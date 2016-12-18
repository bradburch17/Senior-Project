/*
  Fitbit helper for:
    Activity logging
    Authentication
    Sleep logging

  Created by bburch
*/
var FitbitApiClient = require('fitbit-node');
var client = new FitbitApiClient(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
var data; //Stores payload

module.exports = {
    activityDate: activityDate,
    activityToday: activityToday,
    callback: callback,
    getAuthentication: getAuthentication,
    getAuthURL: getAuthURL,
    heartrateToday: heartrateToday,
    profile: profile,
    sleepDate: sleepDate,
    sleepToday: sleepToday,
}

//Retrieves Fitbit Activity by date
function activityDate(req, res) {
    if (req.session.authorized) {
        var date = req.params.date;
        client.get('/activities/date/' + date + '.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
}

//Retrieves Fitbit Activity for the current day
function activityToday(req, res) {
    if (req.session.authorized) {
        client.get('/activities/date/today.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
}

//Retrieves Fitbit callback URL
function callback(req, res) {
    client.getAccessToken(req.query.code, process.env.CALLBACK_URL).then(function(result) {
        req.session.authorized = true;
        req.session.access_token = result.access_token;
        req.session.save();
        res.redirect("/");
    }).catch(function(error) {
        res.send(error);
    });
}

//Retrieves Fitbit Authentication - makes sure logged in to show Fitbit button
function getAuthentication(req, res) {
    if (req.session.authorized) {
        res.json({
            status: req.session.authorized,
            message: 'Returned authentication'
        });
    } else {
        res.json({
            status: false,
            message: 'Returned authentication'
        });
    }
}

//Allows app to be authorized by Fitbit
function getAuthURL(req, res) {
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', process.env.CALLBACK_URL));
}

//Retrieves Fitbit Heartrate by date - NOT IN USE
function heartrateToday(req, res) {
    if (req.session.authorized) {
        client.get('/activities/heart/date/today/1d/1sec/time/00:00/00:01.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
}

//Retrieves Fitbit Profile
function profile(req, res) {
    if (req.session.authorized) {
        client.get('/profile.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        });
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
}

//Retrieves Fitbit Sleep by date
function sleepDate(req, res) {
    if (req.session.authorized) {
        var date = req.params.date;
        client.get('/sleep/date/' + date + '.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        })
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
}

//Retrieves Fitbit Sleep for current day
function sleepToday(req, res) {
    if (req.session.authorized) {
        client.get('/sleep/date/today.json', req.session.access_token).then(function(results) {
            data = results[0];
            res.json(results[0]);
        });
    } else {
        res.status(403);
        res.json({
            errors: [{
                message: 'not authorized'
            }]
        });
    }
}
