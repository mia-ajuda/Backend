const isEntity =  (userName) => 
{
    let userType = userName.trim().split(' ');
    userType = userType.pop();
    
    if (userType == 'PJ'){
        return true;
    } else {
        return false;
    }
}

module.exports = isEntity;