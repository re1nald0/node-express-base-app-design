async function corsMiddleware(req, res, next) {
    var whitelist = [
        'http://localhost',
        'http://localhost:3000',
        'http://localhost:4000',
        'http://localhost:8000',
        'http://localhost:8080',
        'null',
        '*'
    ];
    
    // responde headers de CORS caso esteja na lista
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        //console.log('origin2', req.header('Origin'));
        res.append('Access-Control-Allow-Origin', req.header('Origin'));
        res.append('Access-Control-Allow-Credentials', true);
        res.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.append('Access-Control-Allow-Headers', 'Content-Type, authorization');
    }

    next();
}

module.exports = {
    corsMiddleware
}
