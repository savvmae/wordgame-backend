const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();


app.use(cookieParser());

app.use((request, response, next) => {
    var token = "";
    if(request.cookies){
        token = request.cookies['token'];
    }
    var user = {};
    if(token){
        user.isAuthenticated = true;
        user.name = "bob";
} else {
    user.isAuthenticated = false;
}
    response.locals.user = user;
    next();
});



app.get('/', (req, res) => {
    if(res.locals.user.isAuthenticated){
        res.send('Is authenticated, hello - '+ res.locals.user.name);
    } else {
        res.send("is not authenticated");
    }
   
})

app.listen(3000);