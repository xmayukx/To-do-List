const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const date = require("./date.js");
const mongoose = require('mongoose');
const _ = require('lodash');
// console.log(date());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Database
mongoose.connect("mongodb+srv://admin-mayukh:etywUtj70vvgCmXn@cluster0.vcigxpm.mongodb.net/todolistDB");

// username: admin-mayukh
// password: etywUtj70vvgCmXn

// Set view engine(EJS)
app.set('view engine', 'ejs');

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);
const Task = mongoose.model("Task", itemSchema);

// New custom list Schema
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
// model
const List = mongoose.model("List", listSchema);

// dummy item
const apple = new Item({
    name: "Apple"
});


// Delete
function del() {
    Item.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted!");
        }
    });

    Task.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted!");
        }
    });
}



// Main List Route
app.get("/", function (req, res) {
    // day = date.getDate();
    // passing values using EJS
    // find data
    Item.find(function (err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render("list", {
                listTitle: "Today",
                task: items
            });
        }
    });
});

app.get("/:custom", function (req, res) {
    const pageName = _.capitalize(req.params.custom);

    List.findOne({ name: pageName }, function (err, doc) {
        if (!err) {
            if (!doc) {

                const list = new List({
                    name: pageName,
                    items: [apple]
                })
                list.save();
                res.redirect("/" + pageName);
            } else {
                res.render("list", {
                    listTitle: doc.name,
                    task: doc.items
                })
            }
        }
    })


})


app.post("/", function (request, response) {

    // let work = request.body.task;

    const listName = request.body.list;
    const taskName = request.body.task;
    const bodyItem = new Item({
        name: taskName
    })

    console.log(request.body);
    // defaultItems.push(bodyItem);

    if (request.body.list === "Today") {
        bodyItem.save();
        response.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, doc) {
            doc.items.push(bodyItem);
            doc.save();
            response.redirect("/" + listName);
        })
    }

    // if (request.body.list === "Work") {

    //     const bodyItem = new Task({
    //         name: request.body.task
    //     })
    //     // Inserting in work
    //     bodyItem.save();
    //     response.redirect("/work");
    // } else {

    //     const bodyItem = new Item({
    //         name: request.body.task
    //     })
    //     bodyItem.save();
    //     response.redirect("/");
    // }
});

// Work Route
// app.get("/work", function (req, res) {

//     // find data
//     Task.find(function (err, items) {
//         if (err) {
//             console.log(err);
//         } else {
//             // console.log(items);
//             // console.log(items);
//             res.render("list", {
//                 listTitle: "Work",
//                 task: items
//             });
//         }
//     });
// });

app.post("/delete", function (req, res) {

    const itemID = req.body.delete;
    const listName = req.body.listName;

    if (listName === "Today") {

        Item.deleteOne({ _id: itemID }, function (err) {
            if (err) {
                console.log(err);
            } else {

                console.log("Item with ID " + itemID+ " deleted successfully!");
            }
        })
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id: itemID}}}, function(err,doc){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }

})

app.get("/about", function (req, res) {
    res.render("about");
});

// app.post("/work", function (req, res) {
//     let item = req.body.task;
//     workItems.push(item);
//     res.redirect("/work");
// });


app.listen(3000, function () {
    console.log("Server listening on port 3000");
});