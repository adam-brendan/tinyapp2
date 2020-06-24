const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const randomString = require("randomstring");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

// sends to urls_index.ejs
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// sends to urls_new.ejs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// from urls_new.ejs
app.post("/urls", (req, res) => {
  const shortURL = randomString.generate(6).toString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL.includes("http") ? longURL : "http://" + longURL;
  res.redirect(`/urls/${shortURL}`);
});

// delete button on /urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// form on /urls/:shortURL page
app.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.newURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL.includes("http") ? longURL : "http://" + longURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// sends to urls_show.ejs
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show", templateVars);
});

// page for urls/json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});