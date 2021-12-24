import User from "../models/User";
const spawn = require('child_process').spawn;
var Iconv = require('iconv').Iconv;

// 로그인 페이지
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

// 로그인 처리
export const postLogin = async(req, res) => {
    const { username } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", {
        pageTitle,
        errorMessage: "An account with this username does not exists.",
      });
    }   
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/home");
}

// 회원가입 페이지
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join"});

//회원가입 처리
export const postJoin = async(req, res) => {
    const { name, username } = req.body;
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(400).render("join", {
        pageTitle: "Join",
        errorMessage: "This username is already taken.",
      });
    }
    try{
        await User.create({
            name,
            username,
        });
        return res.redirect("/");
    } catch(error){
        console.log("404");
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error.message,
        });
    }
}

// 홈페이지
export const getHome = async (req, res) => {
    let arr = req.session.user.friends;
    const friends = await User.find({
        'username': { $in: arr }
    });

    if(req.query.result){
        console.log(req.query.result);
        const foodNumber = req.query.result;
        const { _id } = req.session.user;
        
        const food = {
            "1": "아구찜",      
            "2": "육회",
            "3": "보쌈", 
            "4": "비빔밥",
            "5": "설렁탕",
            "6": "닭도리탕",
            "7": "된장찌개",
            "8": "부대찌개",
            "9": "김치볶음밥",
            "10": "냉면",
            "11": "칼국수",
            "12": "불고기",
            "13": "짜장면",
            "14": "짬뽕",
            "15": "김밥",
            "16": "떡볶이",
            "17": "순대",
            "18": "탕수육",
            "19": "마라탕",
            "20": "양고기",
            "21": "새우볶음밥",
            "22": "훠궈",
            "23": "갈비찜",
            "24": "딤섬",
            "25": "스시",
            "26": "규동",
            "27": "소바",
            "28": "타코야키 ",
            "29": "돈가스  ",
            "30": "샤브샤브 ",
            "31": "오므라이스  ",
            "32": "우동",
            "33": "카레",
            "34": "닭갈비",
            "35": "에그 샌드위치",
            "36": "쌀국수",
            "37": "연어회",
            "38": "까르보나라",
            "39": "미트볼스파게티",
            "40": "국밥",
            "41": "스테이크",
            "42": "포테이토피자",
            "43": "마르게리따피자",
            "44": "수제버거",
            "45": "삼겹살",
            "46": "제육볶음 ",
            "47": "파니니  ",
            "48": "생선구이 ",
            "49": "후라이드치킨 ",
            "50": "양념치킨 ",
            "51": "모듬회  ",
            "52": "만두국  ",
            "53": "대하소금구이 ",
            "54": "도넛 ",
            "55": "애플파이 ",
            "56": "곱창",
            "57": "비프웰링턴  ",
            "58": "회덮밥  ",
            "59": "치즈케이크  ",
            "60": "막국수  ",
            "61": "라면",
            "62": "안동찜닭",
            "63": "계란찜",
            "64": "파전",
        };
        
        console.log(food[foodNumber]);

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                like: food[foodNumber],
            }
        )
        req.session.user = updatedUser;
    }


    return res.render("home", {pageTitle: "Home", friends, errorMessage: ""});
}

// 친구 추가 기능
export const postAddFriend = async (req, res) => {
    const { friendname } = req.body;
    const { _id } = req.session.user;
    let arr = req.session.user.friends;
    const exists = await User.exists({ username: friendname });
    const friends = await User.find({
        'username': { $in: arr }
    });
    if (!exists) {
      return res.status(400).render("home", {
        pageTitle: "Home",
        errorMessage: "username doesn't exists",
        friends,
      });
    }
    if(arr.indexOf(friendname)>=0){
        return res.status(400).render("home", {
        pageTitle: "Home",
        errorMessage: "Already friend!",
        friends,
      });
    }
    arr.push(friendname);
    const newFriends = await User.find({
        'username': { $in: arr }
    });
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            friends: arr,
        }
    )
    req.session.user = updatedUser;
    return res.render("home", {
        pageTitle: "Home",
        friends: newFriends,
    });
} 

// 음식 이상형 월드컵 페이지
export const worldcup = (req, res) => {
    return res.render("worldcup");
}

// 단체밥 버튼 / 결과 페이지
export const recommendFood = async(req, res) => {
    let arr = req.session.user.friends;
    let list = [];
    let recommendFoods = [];
    const friends = await User.find({
        'username': { $in: arr }
    });
    if(req.query.foodsList){
        if(req.query.foodsList != "N"){
            list = JSON.parse(req.query.foodsList);
        }
        console.log("userlike" + req.session.user.like);
        list.push(req.session.user.like);
        // const message = list.join(" ");
        // console.log(message);
        list.unshift(process.cwd() + '/src/controllers/DevKor-Hackathon-main/src/main.py');
        console.log(list);
        const net = spawn('python',list);
        console.log("here!210");
        net.stderr.on('data', function(data){
            var iconv = new Iconv('euc-kr', 'utf-8');
            const recommendFood = iconv.convert(data).toString('utf-8');
            console.log('stderr: '+recommendFood);
        });
        net.stdout.on('data', function(data) { 
            //console.log(data);
            //recommendFoods = data.toString('utf-8');
            //console.log("here!214");
            var iconv = new Iconv('euc-kr', 'utf-8');
            const recommendFood = iconv.convert(data).toString('utf-8');
            console.log(recommendFood);
            const rep1 = recommendFood.replace(/\[/g,"");
            const rep2 = rep1.replace(/\]/g,"");
            const rep3 = rep2.replace(/\'/g,"");
            console.log(rep3);
            recommendFoods = rep3.split(',');
            console.log(recommendFoods);
            return res.render("recommend", {pageTitle: "Recommend Food", friends, recommendFoods, k:1});
        })
    }
    else{
        return res.render("recommend", {pageTitle: "Recommend Food", friends, recommendFoods, k:0});
    }
}

export const postRecommendFood = async(req, res) => {
    const { foodsList } = req.body;
    console.log(foodsList);
}

 

