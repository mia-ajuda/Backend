const SocialNetworkRepository = require("../repository/SocialNetworkRepository");
const EntityRepository = require("../repository/EntityRepository");
const firebase = require("../config/authFirebase");
const { ObjectID } = require("mongodb");

class SocialNetworkService {
  constructor() {
    this.socialNetworkRepository = new SocialNetworkRepository();
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

    let a = await this.socialNetworkRepository.getUserByIdWithHelpsAndOffers(userId);    
    console.log(a.number_of_followers);
    console.log(a.number_of_following);
    return true;



    let followedUser = await this.socialNetworkRepository.findUserProfilebyUserId(userId);
    let followerUser = await this.socialNetworkRepository.findUserProfilebyUserId(followerId);
    
    console.log(global.isUserEntity);
    console.log(followedUser);
    console.log(followerUser);
    if(!followedUser){
      throw new Error ("Followed user profile not found");
    } else if (!followerUser){
      throw new Error ("Follower user profile not found");
    }

    const followerPosition = followedUser.followers.indexOf(followerId);
    const followingPosition = followerUser.following.indexOf(userId);
    if (followerPosition > -1 || followingPosition > -1) {
      throw new Error("Usuário já é um seguidor");
    }
    
    followedUser.followers.push(followerId);
    followerUser.following.push(userId);

    await this.socialNetworkRepository.updateProfile(followedUser);
    await this.socialNetworkRepository.updateProfile(followerUser);
    
  }

  async unfollowUser(followerId, userId){
  
    let followedUser = await this.socialNetworkRepository.findUserProfilebyUserId(userId);
    let followerUser = await this.socialNetworkRepository.findUserProfilebyUserId(followerId);
    
    console.log(followedUser);
    console.log(followerUser);
    if(!followedUser){
      throw new Error ("Followed user profile not found");
    } else if (!followerUser){
      throw new Error ("Follower user profile not found");
    }

    const followerPosition = followedUser.followers.indexOf(followerId);
    const followingPosition = followerUser.following.indexOf(userId);
    if (followerPosition < 0  || followingPosition < 0) {
      throw new Error("Usuário não é um seguidor");
    }
    
    followedUser.followers.splice(followerPosition,1);
    followerUser.following.splice(followingPosition,1);

    await this.socialNetworkRepository.updateProfile(followedUser);
    await this.socialNetworkRepository.updateProfile(followerUser);

  }


  async findUsers(userId,username) {

    const user = await this.socialNetworkRepository.findUsersbyName(userId,username);

    if(!user){
      throw new Error("Nenhuma usuário encontrado");
    }
    return user;
  }

}

module.exports = SocialNetworkService;
