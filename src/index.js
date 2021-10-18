const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const Database = require("better-sqlite3");
// create and config server
const server = express();
server.use(cors());
server.use(express.json());


// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});


//servidor estático películas
const staticServerPathMovies = "./src/public-react"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathMovies));
//servidor estático imágenes
const staticServerPathImage = './src/public-movies-images';
server.use(express.static(staticServerPathImage));


// VIEW EJS motor de plantillas

server.set('view engine', 'ejs');

//database

const db =new Database("./src/db/database.db", {
  verbose: console.log,
});

const dbUser =new Database("./src/db/users.db", {
  verbose: console.log,
});

//endpoints

server.get("/database", (req, res) => {
 
  const query = db.prepare("SELECT * FROM database order by name asc");
  const moviesFound = query.all();
  res.json( moviesFound);
  
});

server.post('/login', (req, res) => {
  const email=req.body.userEmail;
  const password=req.body.userPassword;
 
  if(!email || !password){
    res.sendStatus(404)
  }
  else{
     const query = dbUser.prepare('SELECT * FROM users WHERE email = ? and password = ? ');
  const userAll = query.get(email, password);
  if(userAll !== undefined){
    res.json({userId: userAll.id});
  }else{
    res.json({error: "Usuario no encontrado "});
  }
  }
  
  res.json(response);
});

server.post("/sign-up", (req, res) => {
  let response = req.body;
   if(req.body.userEmail ===''||req.body.userPassword ===''){
      response = { 
        success: true, 
        error: "debes rellenar todos los campos"}
   }else{
     const query = db.prepare('INSERT INTO users (email,password) VALUES (?,?)')
     const result = query.run(req.body.userEmail,req.body.userPassword);
      response = { 
       success: true, 
       userId: result.lastInsertRowId}
   }
   res.json(response);
 });