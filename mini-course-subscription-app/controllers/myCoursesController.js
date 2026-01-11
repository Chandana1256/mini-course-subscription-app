const courses = [
  { id: "1", title: "HTML & CSS Basics", description: "Learn fundamentals of web design", price: 0, type: "FREE" },
  { id: "2", title: "JavaScript Mastery", description: "Deep dive into JavaScript", price: 1000, type: "PAID" },
  { id: "3", title: "React for Beginners", description: "Build modern UIs", price: 1200, type: "PAID" },
  { id: "4", title: "Node.js Essentials", description: "Backend with Node.js", price: 0, type: "FREE" },
  { id: "5", title: "Full Stack Basics", description: "Frontend + Backend", price: 1500, type: "PAID" }
];

exports.getCourses = (req, res) => {
  res.json(courses);
};
