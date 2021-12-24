import express from "express";
import { getLogin, postLogin, getJoin, postJoin, getHome, postAddFriend, worldcup, recommendFood, postRecommendFood} from "../controllers/rootController";

const rootRouter = express.Router();

rootRouter.route("/").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/home").get(getHome).post(postAddFriend);
rootRouter.route("/worldcup").get(worldcup);
rootRouter.route("/recommend-food").get(recommendFood).post(postRecommendFood);

export default rootRouter;
