var express = require("express");
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/blogApp");


//Creating DB schema 

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//Creating DB
// Blog.create({
//     title: "Tiger",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPUxK1cIux9AgqXR_bWKfcP_hLoaVmgOuV8PyLsOXXS3AH5foBQ&s",
//     body: "The Great Dane is a German breed of domestic dog known for its giant size."

// });


// Home page ROUTE





app.get("/", function(req, res) {
    res.redirect("/blogs");

});


// Route to display all blogs as well as Home page
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs });
        }

    });


});


// Route to get form to create new blog
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// route for POST request to submit data from form

app.post("/blogs", function(req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);


    // collect data from from

    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            console.log("ERRROORRR!!");
        } else {
            res.redirect("/blogs");

        }

    });
});

// Creating route to SHOW particular blog with ID

app.get("/blogs/:id", function(req, res) {
    // res.render("show");

    Blog.findById(req.params.id, function(err, blog) {

        if (err) {
            console.log(err);
        } else {
            res.render("show", { blog: blog });
        }

    });

});


// Creating route to edit blog and update

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/")
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });

});

// Updating Route

app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete Route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });

});







app.listen(3000, function() {
    console.log("Blog server is running");
});