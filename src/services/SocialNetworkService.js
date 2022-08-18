const SocialNetworkRepository = require("../repository/SocialNetworkRepository");
const EntityRepository = require("../repository/EntityRepository");
const firebase = require("../config/authFirebase");
const { ObjectID } = require("mongodb");
const HelpRepository = require("../repository/HelpRepository");
const OfferdHelpRepository = require("../repository/HelpOfferRepository");


class SocialNetworkService {
  constructor() {
    this.socialNetworkRepository = new SocialNetworkRepository();
    this.helpRepository = new HelpRepository();
    this.offerdHelpRepository = new OfferdHelpRepository();
  }

  async createSocialNetworkUser(createdUser) {
    

    const socialProfileData = {
      username: createdUser.name,
      userId: createdUser._id,
    };
  
    const createdSocialNetworkUser = await this.socialNetworkRepository.create(socialProfileData);
    console.log(createdSocialNetworkUser);
    return createdSocialNetworkUser;

  }


  async removeSocialNetworkUser(id){

    await this.socialNetworkRepository.destroy(id);

  }


  async followUser(followerId, userId){

    let user = await this.socialNetworkRepository.findUserProfilebyProfileId(userId);
    let follower = await this.socialNetworkRepository.findUserProfilebyUserId(followerId);
    
    if(!user){
      throw new Error ("User profile not found");
    } else if (!follower){
      throw new Error ("Follower user profile not found");
    }

    const followerPosition = user.followers.indexOf(followerId);
    const followingPosition = follower.following.indexOf(userId);
    if (followerPosition > -1 || followingPosition > -1) {
      throw new Error("Usuário já é um seguidor");
    }
    
    user.followers.push(followerId);
    follower.following.push(userId);

    await this.socialNetworkRepository.updateProfile(user);
    await this.socialNetworkRepository.updateProfile(follower);

    return true;
    
  }

  async unfollowUser(followerId, userId){
  
    let user = await this.socialNetworkRepository.findUserProfilebyProfileId(userId);
    let follower = await this.socialNetworkRepository.findUserProfilebyUserId(followerId);
    
    if(!user){
      throw new Error ("Followed user profile not found");
    } else if (!follower){
      throw new Error ("Follower user profile not found");
    }

    const followerPosition = user.followers.indexOf(followerId);
    const followingPosition = follower.following.indexOf(userId);
    if (followerPosition < 0  || followingPosition < 0) {
      throw new Error("Usuário não é um seguidor");
    }
    
    user.followers.splice(followerPosition,1);
    follower.following.splice(followingPosition,1);

    await this.socialNetworkRepository.updateProfile(user);
    await this.socialNetworkRepository.updateProfile(follower);
    return false;
  }


  async findUsers(userId,username) {

    const users = await this.socialNetworkRepository.findUsersbyName(userId,username);

    if(!users){
      throw new Error("Nenhum usuário encontrado");
    }
    return users;
  }

  async getUserActivities(userId){

    let helper = false;
    let statusList = ['waiting','on_going','finished','owner_finished','helper_finished'];
    let getOtherUsers = true;
    let categoryArray = null;
    
    let helps = await this.helpRepository.getHelpListByStatus(userId, statusList, helper);
    let offers = await this.offerdHelpRepository.list(userId, categoryArray, getOtherUsers);

    let activities = {helps,offers};
    console.log(activities);
    return activities;
  }

}

module.exports = SocialNetworkService;
