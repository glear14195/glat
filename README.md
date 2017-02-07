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
                err: (empty on success else err msg) ['User exists','execution_error','conn_error','','Missing Arguments']
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

    /group/add
    ->hit to add group
        req:
            {
                phone,gname,mems,token
                []
            }        