const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(cors());
app.use(express.json());

// console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);

const studentSchema = new mongoose.Schema({
  name: String,
  location: String,
  cgpa: Number,
});

const Student = mongoose.model("Student", studentSchema);

app.get("/api/students", async (req, res) => {
  const data = await Student.find({});
  if (!data) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve students" });
  } else {
    res.json(data);
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { name, location, cgpa } = req.body;
    const newStudent = new Student({
      name,
      location,
      cgpa,
    });

    await newStudent.save();
    // console.log("save successfully");
    res.status(200).json(newStudent);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const { name, location, cgpa } = req.body;
    const studentId = req.params.id;
    // console.log(name, location, cgpa);
    const updatedStudent = await Student.findByIdAndUpdate(studentId, {
      name,
      location,
      cgpa,
    });
    // console.log("save successfully");
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    // console.log("id", req.params.id);
    const studentDetail = await Student.findById(req.params.id);
    if (!studentDetail) throw Error("No such student exists!");
    await studentDetail.deleteOne();
    // console.log("deleted successfully");
    res.status(200).json("Student deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
