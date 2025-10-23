import React, { useState, useEffect } from 'react';
import './ContactUs.css';
import emailjs from 'emailjs-com';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
const appointmentTypes = [
  'General Appointment',
  'Consultation',
  'Follow-up',
  'Other',
];

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: appointmentTypes[0],
    message: '',
    image: undefined,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emailjs.send(
        'service_vhb9kp5',
        'template_f3g851v',
        {
          user_name: form.name,
          user_email: form.email,
          user_phone: form.phone,
          appointment_type: form.appointmentType,
          user_message: form.message,
        },
        'ctXqN7l3WMp1Er5nz'
      );
      setSubmitted(true);
    } catch (error) {
      alert('Failed to send message. Please try again later.');
    }
  };

  useEffect(() => {
    // Initialize EmailJS with the new public key so it's set globally
    try {
      emailjs.init('ctXqN7l3WMp1Er5nz');
    } catch (e) {
      // ignore init errors — send will still attempt using the key passed to send
    }
  }, []);

  return (
    <div className="contact-container">
      <div>
        <form className="contact-form contact-form-centered" onSubmit={handleSubmit}>
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="contact-success">Thank you for reaching out! We'll get back to you soon.</div>
          ) : (
            <>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 78932 54003"
                  value={form.phone}
                  onChange={handleChange}
                />
                <select
                  name="appointmentType"
                  value={form.appointmentType}
                  onChange={handleChange}
                  title="Appointment Type"
                >
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <textarea
                name="message"
                placeholder="Please provide details about your inquiry..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
              />
              {/* Removed image upload field as requested */}
              <button type="submit" className="contact-submit">Send Message</button>
            </>
          )}
        </form>
  <div className="contact-content contact-content-margin">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-info-item">
              <span className="contact-icon-wrapper"><FaEnvelope size={40} color="#4f8cff" /></span>
              <div>
                <strong>Email</strong>
                <div>SymptomAnalyzer@gmail.com</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-icon-wrapper"><FaPhone size={40} color="#4f8cff" /></span>
              <div>
                <strong>Phone</strong>
                <div>+91 63026 31679</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-icon-wrapper"><FaMapMarkerAlt size={40} color="#4f8cff" /></span>
              <div>
                <strong>Office</strong>
                <div>Vidyut Nagar<br />Kakinada, Andhra Pradesh 533003</div>
              </div>
            </div>
            <div className="contact-response">
              <strong>Response Time</strong>
              <div>We typically respond to all inquiries within 24-48 hours. For urgent matters, please call our support line.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }
