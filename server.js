let express = require('express');
let app = express();

app.use(express.static(__dirname+'/dist/capoeira-app'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/dist/capoeira-app/index.html'))
});

app.listen(process.env.PORT || 8080);
