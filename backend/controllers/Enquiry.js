const Enquiry = require("../models/Enquiry");

//?                      DONE                      //
exports.addEnquiry = async (req, res) => {
  const { name, phone, email, message } = req.body;
  console.log(req.body);
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !phone || !message) {
    return res
      .status(400)
      .json({ msg: "Name, Phone Number, and Message are required!" });
  }
  if (!nameRegex.test(name)) {
    return res.status(400).json({
      msg: "Invalid name format. Only letters and spaces are allowed.",
    });
  }
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ msg: "Invalid phone number format." });
  }
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email format." });
  }
  if (message.length > 250) {
    return res.status(400).json({ msg: "Meaasge can be max 250 characters." });
  }

  const enquiry = new Enquiry({
    name,
    phone,
    email,
    message,
  });
  await enquiry.save();
  return res.status(200).json({ msg: "Enquiry submitted successfully." });
};

//?                      Pending                      //

exports.getEnquires = async (req, res) => {
  try {
    const enquires = await Enquiry.find().lean();
    if (!enquires) {
      return res.status(404).json({ msg: "There are no Enquiries." });
    }
    return res.status(200).json(enquires);
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error." });
  }
};
