//For GLAT

APIS:

    /user/sendotp
    ->first api to hit
        req:
            {
                phone,name
            }
        res:
            {
                status: (success or fail),
                err: (empty on success else err msg) ['User exists','execution_error','conn_error','Missing Arguments']
                resp:{
                    contains otp on success.//To resend otp hit same api again 
                    on error 'User exists' contains name of user.
                    errors execution_error and conn_error thrown on pgclient errors.
                    //resp also contains msg, which could be displayed on client side** (not for all errors - see code)
                }
            }

    /user/login
    ->To hit after signup
        req:
            {
                phone
            }
        res:
            {
                status:['success','fail'],
                err:['no such user','redis_error','Missing Arguments','execution_error','conn_error'],
                resp:{
                    contains token on success
                }
            }

    /group/updateOrCreate
    ->hit to add group
        req:
            {
                phone,gname,mems (Array of phone numbers),token
            }
        res:
            {
                status: ['success','fail'],
                err: ['Group already exists','Missing arguments','execution_error','login_again','redis_error']
                resp: {
                    added: [array of numbers added to group],
                    notAdded: [array of numbers not added to group],
                    gid: unique group identifier
                }                    
            }

    /user/contacts/view
    ->hit for viewing contacts list
        req:
            {
                phone,token,contacts array(Array of JSON objects of name & phome)
            }
        res:
            {
                status: ['success','fail'],
                err: ['execution_error','Missing arguments'],
                resp: [{dname,phone,is_member,pic_location}]
            }

    /group/message/add
    ->hit for adding message
        req:
            {
                phone,token,lat(-90 to 90),long(-180 to 180),body,sensorData(object),gid
            }
        res:
            {
                status: status: ['success','fail'],
                err: ['exec_error', 'login_again', 'Incorrect parameters', 'No such group']
                resp: "Message added" (on success)
            }

    /file/upload
    -> hit for uploading file
        req: 
        {
            phone, token, file
        }
        res:
        {
            status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: fileName
        }
    
    /file/download
    ->hit for downloading file
        req: 
        {
            phone, token, fileName
        }
        res:
        {
            status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: fileName
        }

     /user/updateProfile
     -> API for profile update
        req:
        {
            phone,token,name,picLoc
        }
         res:
        {
            status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: "Profile updated"
        }

    /group/showAllMessages
    -> API for listing all messages of group
       req:
       {
           phone,token,gid,coord (array of Lat,Long)
       }
       res:
       {
           status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: JSON array of messages (body,lat,long,gid,mi,createdByNum,createdbyName,createdAt,,sensorData (JSON obj))
       }

    /group/addMessageFeed
     -> API for adding comment in the message feed
      req:
      {
          phone,token,gid,mid,comment
      }
      res:
      {
          status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: "Comment added in the message"
      }

      /group/displayMessageFeed
      ->API for displaying all comments of the message
      req:
      {
          phone,token,gi,mid
      }
      res:
      {
         status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: JSON array of message feed  (dname,comment,createdAt,pic_location)
      }

      /group/markMessageRead
      ->API for updating the read status of a message for the user
      req:
      {
          phone,token,mid,gid
      }
       res:
      {
         status: ['success','fail'],
            err: ['exec_error', 'login_again', 'Incorrect parameters'],
            resp: "Message in read status"
      }
      
      