# DevKor-Hackathon
Hackathon on August 21.

## 프로그램명

* 음식 월드컵을 통한 **음식 추천 시스템**

## 프로그램 개요 
* 웹사이트에서 음식 월드컵을 진행하고 음식 월드컵 결과에 따라 사용자가 좋아할만한 음식을 추천해준다.

## 프로그램 구성

```
template_project
├── dataset
│   ├── FoodLists.csv
│   └── FoodData.csv
├── src
│   ├── Dataset.py
│   ├── Recommender.py
│   └── main.py
└── README.md
```

1. src

* 파이썬 프로그램이 저장될 소스 폴더

2. dataset

* 음식 리스트를 담은 csv 파일이 저장되어 있다.
* 파이썬 코드를 통해 Wikipedia에 있는 음식 데이터를 크롤링하여 만든 자체 Dataset을 csv파일로 저장한다.

## 역할 배정

* 웹사이트 구성 : 이건협
* 추천시스템 및 데이터셋 형성 : 안수진

## 웹사이트 구성

1. 로그인 페이지

* mongodb를 이용해 user db 구현
* 회원가입시 username 중복을 검사해서 방지함
* user model에는 username, name, like, friends 요소가 있음

2. 홈페이지

* 친구추가 기능: username을 검색하면 user db에서 해당 username을 찾아서 원하는 친구를 follow할 수 있음
* 팔로우 한 친구들은 홈페이지에 목록으로 정렬됨

3. 음식 (이상형) 월드컵

* 64강으로 구성된 음식 이상형 월드컵
* 이상형 월드컵의 결과는 user model의 like에 저장되어 추후 메뉴추천에 사용됨

4. 혼밥 추천 페이지

* user model의 like에 있는 정보를 토대로 혼밥 메뉴 4가지를 추천해줌

5. 단체밥 추천 페이지

* 홈페이지에서 여러친구를 선택하면 단체밥을 추천받을 수 있음
* 모든 친구들의 like를 토대로 메뉴를 추천해줌

## 추천시스템 및 데이터셋 

1. Dataset 형성 및 전처리 과정

* FoodList가 있는 csv 파일을 parsing한 후, wikipedia 크롤링을 통해 음식 사진 URL 및 음식 관련 정보를 불러온다.
* 음식이름 중 중복되는 항 제거
* Description column에서 중복되는 단어 제거
* foodName을 제외한 나머지 항은 하나의 str으로 합침[foodName, foodDescription]

2. 음식 추천

* Content-based filtering 사용
* 음식 월드컵에서 1위한 음식과의 코사인 유사도를 계산하여 코사인 유사도가 높은 항목을 순서대로 추천
* 1명일 경우, 그 개인의 1위 음식만을 가지고 코사인 유사도 계산
* 여러명일 경우, 각각 1위 음식의 feature를 합쳐서 새로운 row로 만들고 그 row와의 코사인 유사도를 계산하여 유사도가 높은 순서대로 추천
