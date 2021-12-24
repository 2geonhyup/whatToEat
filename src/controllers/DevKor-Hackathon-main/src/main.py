import pandas as pd
import numpy as np
import sys
import pathlib
from pathlib import Path
from bs4 import BeautifulSoup
import requests
import csv
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

sys.path.insert(
    0,
    str(
        Path(
            Path(
                Path(
                    Path(Path(__file__).parent.absolute()).parent.absolute()
                ).parent.absolute()
            ).parent.absolute()
        )
    ),
)
from Dataset import Dataset
from Recommender import Recommender
from Connection import WebConnect


def main(argv):
    db = Dataset()
    foodNameList = db.csvParser(
        "src/controllers/DevKor-Hackathon-main/dataset/FoodLists.csv"
    )
    dataset = db.csvParser("src/controllers/DevKor-Hackathon-main/dataset/foodDB.csv")
    dataset = dataset[1:]
    columns = [
        "foodName",
        "Type",
        "Country",
        "Region",
        "Ingredient",
        "Calorie",
        "imgUrl",
        "Description",
    ]
    foodData = pd.DataFrame(data=dataset, columns=columns)
    # foodName이 중복되는 항 제거
    foodData.drop_duplicates(subset=["foodName"], keep="first", inplace=True)

    df = foodData.drop(["imgUrl"], axis=1)
    df.fillna(" ", inplace=True)

    # description부분 중복 단어 제거
    detail = []
    for i in df.Description:
        tmp = i.split(" ")  # list
        tmp = set(tmp)
        tmp = list(tmp)
        for j in range(len(tmp)):
            if "." in tmp[j]:
                replaced = tmp[j].split(".")[0]
                tmp[j] = replaced
            if "[" in tmp[j]:
                replaced = tmp[j].split("[")[0]
                tmp[j] = replaced
        detail.append(tmp)
    for d in range(len(detail)):
        detail[d] = set(detail[d])
        detail[d] = list(detail[d])

    df["Detail"] = detail  # 데이터프레임에 결과 저장

    df = df.drop(["Description"], axis=1)

    # description 부분을 string으로
    explanation = df.Detail.values.tolist()
    exp = []
    for lst in explanation:
        tmp = " ".join(lst)
        string = ""
        string += tmp
        string += " "
        exp.append(string)
    df["Explanation"] = exp

    # foodName을 제외한 나머지 부분을 하나의 string으로 처리
    manipulate = df[["Type", "Country", "Region", "Ingredient", "Explanation"]]
    manipulate = manipulate.values.tolist()
    concat = []
    for lst in manipulate:
        tmp = " ".join(lst)
        string = ""
        string += tmp
        concat.append(string)

    # 새로운 데이터 프레임에 정리
    data = pd.DataFrame(data=None, columns=["foodName", "foodDescription"])
    data["foodDescription"] = concat
    data["foodName"] = df["foodName"].values.tolist()

    web = WebConnect()
    rec = Recommender()
    if len(argv[1:]) == 1:
        name = argv[1]
        foodName = web.getWinner(name, foodNameList)
        result = rec.singleRecommendation(data, foodName)
        result = web.sendRecommend(foodData, result)

        for i in range(len(result)):
            result[i][0] = web.toKor(foodNameList, result[i][0])
        print(result)

    elif len(argv[1:]) >= 2:
        names = argv[1:]
        numRecommend = len(names) + 3
        engNames = []
        for n in names:
            eng = web.getWinner(n, foodNameList)
            engNames.append(eng)
        result = rec.doubleRecommendation(data, numRecommend, engNames)
        result = web.sendRecommend(foodData, result)
        for i in range(len(result)):
            result[i][0] = web.toKor(foodNameList, result[i][0])
        print(result)
        sys.stdout.flush()


if __name__ == "__main__":
    main(sys.argv)
