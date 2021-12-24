from bs4 import BeautifulSoup
import requests
import pandas as pd
import numpy as np
import csv

class Dataset:
    def getWiki(self, foodName):
        website = requests.get('https://en.wikipedia.org/wiki/'+ foodName) 
        soup = BeautifulSoup(website.text, 'html.parser')
        try:
            Type = soup.find(class_ = 'infobox-data').text.strip()
        except:
            Type = None
            pass
        try:
            Country = soup.find(class_ = 'infobox-data country-name').text.strip()
        except:
            Country = None
            pass
        try:
            Region = soup.find(class_ = 'infobox-data region').text.strip()
        except:
            Region = None
            pass
        try:
            Ingredient = soup.find(class_ = 'infobox-data ingredient').text.strip()
        except:
            Ingredient = None
            pass
        try:
            Calorie = soup.find(class_ = 'infobox-data nutrition').text.strip().split('kcal')[0]
        except:
            Calorie = None
            pass
        try:
            imgTag = soup.find('img')
            imgUrl = imgTag.get('src')
        except:
            imgUrl = None
            pass
        try: 
            des = soup.find(class_ = 'mw-parser-output')
            Description = des.find('p').text.strip()
        except:
            Description = None
            pass
        return [foodName, Type, Country, Region, Ingredient, Calorie, imgUrl, Description]

    def csvParser(self, file):
        f = open(file, 'r', encoding = 'utf-8')
        reader = csv.reader(f)
        csvList = []
        for line in reader:
            csvList.append(line)
        return csvList

    def makeDataset(self, file):
        foodNameList = self.csvParser('dataset/FoodLists.csv')

        foodNames = [] # foodName을 1차원 리스트로 저장
        for lst in foodNameList:
            foodNames.append(lst[0])

        foodNames = foodNames[1:]
        columns = ['foodName', 'Type', 'Country', 'Region', 'Ingredient', 'Calorie','imgUrl', 'Description']
        foodData = pd.DataFrame(data = None, columns = columns) #main db

        for food in foodNames:
            foodinfo = db.getWiki(food)
            foodData = foodData.append(pd.Series(foodinfo, index = foodData.columns), ignore_index = True)

        return foodData.to_csv('dataset/foodDB.csv', sep = ',')