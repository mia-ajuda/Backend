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

    console.log(socialProfileData.username);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(socialProfileData.userId);
    

    return this.socialNetworkRepository.create(socialProfileData);


  }


  async followUser(followerId, followedId){

    let followedUser = await this.socialNetworkRepository.findUserProfilebyUserId(followedId);
    let followerUser = await this.socialNetworkRepository.findUserProfilebyUserId(followerId);
    
    console.log(followedUser);
    console.log(followerUser);
    if(!followedUser){
      throw new Error ("Followed user profile not found");
    } else if (!followerUser){
      throw new Error ("Follower user profile not found");
    }

    const followerPosition = followedUser.followers.indexOf(followerId);
    const followingPosition = followerUser.following.indexOf(followedId);
    if (followerPosition > -1 || followingPosition > -1) {
      throw new Error("Usuário já é um seguidor");
    }
    
    followedUser.followers.push(followerId);
    followerUser.following.push(followedId);

    await this.socialNetworkRepository.updateProfile(followedUser);
    await this.socialNetworkRepository.updateProfile(followerUser);
    
  }

  async unfollowUser(followerId, followedId){
  
    let followedUser = await this.socialNetworkRepository.findUserProfilebyUserId(followedId);
    let followerUser = await this.socialNetworkRepository.findUserProfilebyUserId(followerId);
    
    console.log(followedUser);
    console.log(followerUser);
    if(!followedUser){
      throw new Error ("Followed user profile not found");
    } else if (!followerUser){
      throw new Error ("Follower user profile not found");
    }

    const followerPosition = followedUser.followers.indexOf(followerId);
    const followingPosition = followerUser.following.indexOf(followedId);
    if (followerPosition < 0  || followingPosition < 0) {
      throw new Error("Usuário não é um seguidor");
    }
    
    followedUser.followers.splice(followerPosition,1);
    followerUser.following.splice(followingPosition,1);

    await this.socialNetworkRepository.updateProfile(followedUser);
    await this.socialNetworkRepository.updateProfile(followerUser);

  }

}

module.exports = SocialNetworkService;
