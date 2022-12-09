const Authentication = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect("/signin");
    }
    
    next();
    
};
const Authentication1 = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/signin");
    }
    
    next();
    
};



module.exports = {
     Authentication,
     Authentication1
 };