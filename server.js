let express = require('express');
let app = express();

app.use(express.static(__dirname+'/dist/capoeira-angular'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/dist/capoeira-angular/index.html'))
});

app.listen(process.env.PORT || 8080);
