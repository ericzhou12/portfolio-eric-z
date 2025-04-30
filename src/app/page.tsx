"use client";
import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Mail, MessageSquare, Code, User, Moon, Sun } from 'lucide-react';


export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Apply dark mode class to document body on mount and when changed
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const projects = [
    {
      title: "Modified Black-Litterman Investment Model",
      description: "Stock allocation model built using Python; Won Semifinalist in the Wharton Global High School Investment Competition (50/5000+ teams)",
      tags: ["Python", "MatPlotLib", "Jupyter Notebook", "SciPy", "pandas"],
      image: "/api/placeholder/600/400"
    },
    {
      title: "Neural Network for Water Quality",
      description: "Artificial neural network built with PyTorch which leveraged EPA datasets to predict water quality; Won NOAA Taking the Pulse of the Planet and Stockholm Junior Water Prize",
      tags: ["Python", "PyTorch", "MatPlotLib", "pandas", "Jupyter Notebook"],
      image: "/api/placeholder/600/400"
    },
    {
      title: "none but need to fit 1 more :skull:",
      description: "homeless jobless broke mcdonalds owrker",
      tags: ["React.js"],
      image: "/api/placeholder/600/400"
    }
  ];

  const skills = [
    "Solidity", "Python", "C++", "Foundry", "React.js", "PyTorch", "MatPlotLib", "Next.js", "HTML/CSS", "Java"
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-['Space Mono']">
      {/* Custom font import - Add this to your index.html or CSS file */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        body {
          font-family: 'Space Mono', monospace;
        }
      `}</style>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-600 bg-clip-text text-transparent">Eric Zhou</span>
            </div>
            
            {/* Theme toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors absolute left-1/2 transform -translate-x-1/2"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
              <a href="#projects" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</a>
              <a href="#skills" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Skills</a>
              <a href="#contact" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-3 space-y-2">
              <a href="#about" className="block px-3 py-2 rounded-md font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">About</a>
              <a href="#projects" className="block px-3 py-2 rounded-md font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Projects</a>
              <a href="#skills" className="block px-3 py-2 rounded-md font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Skills</a>              
              <a href="#contact" className="block px-3 py-2 rounded-md font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Contact</a>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-white via-zinc-400 to-white dark:bg-gradient-to-br dark:from-black dark:via-zinc-800 dark:to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-black to-white dark:bg-gradient-to-r dark:from-white dark:to-black bg-clip-text text-transparent">
              ERIC ZHOU
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-slate-900 dark:text-slate-200">
              Comp Sci STUDENT!!!!HSHASODI
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4">
              <a href="#contact" className="bg-zinc-800 border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20">
                Get in Touch
              </a>
              <a href="#projects" className="bg-zinc-800 border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20">
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-bl from-white via-zinc-400 to-white dark:from-black dark:via-zinc-800 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center relative">
            <span className="bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600 bg-clip-text text-transparent">About Me</span>
            <div className="absolute w-24 h-1 bg-black dark:bg-white left-1/2 transform -translate-x-1/2 mt-2"></div>
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full transform -translate-x-2 -translate-y-2"></div>
                <img 
                  src="/api/placeholder/400/400" 
                  alt="Profile" 
                  className="relative rounded-full w-64 h-64 object-cover mx-auto shadow-xl border-4 border-white dark:border-slate-800"
                />
              </div>
            </div>
            <div className="md:w-2/3 mt-8 md:mt-0">
              <p className="text-lg mb-4 text-slate-700 dark:text-slate-300">
                Hi! I'm a passionate computer science student with a very expansive and unique skillset! I'm incoming at <a href="https://www.stonybrook.edu/simons/" target="https://www.stonybrook.edu/simons/"> <span className='text-underline'>Simons Summer Research Program</span></a> in blockchain and distributed systems with Prof. Mohammad Javad Amiri and have done research with Prof. Shiyong Lu at Wayne State University. I've also worked with neural networks and ML using Python and web dev and React.js with this portfolio site!
              </p>
              
              {/* Custom alert */}
              <div className="mt-8 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20 border-l-4 border-blue-600 rounded-lg p-4 shadow-lg">
                <h4 className="text-blue-700 dark:text-blue-400 font-semibold mb-1">Currently Available for Work</h4>
                <p className="text-slate-700 dark:text-slate-300">
                  I'm open to discussing new projects and opportunities. Feel free to reach out!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gradient-to-br from-white via-zinc-400 to-white dark:from-black dark:via-zinc-800 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center relative">
            <span className="bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600  bg-clip-text text-transparent">My Projects</span>
            <div className="absolute w-24 h-1 bg-black dark:bg-white left-1/2 transform -translate-x-1/2 mt-2"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                      View Details <ExternalLink size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20">
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gradient-to-bl from-white via-zinc-400 to-white dark:from-black dark:via-zinc-800 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center relative">
            <span className="bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600 bg-clip-text text-transparent">Skills & Technologies</span>
            <div className="absolute w-24 h-1 bg-black dark:bg-white  left-1/2 transform -translate-x-1/2 mt-2"></div>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-slate-100 dark:bg-slate-700/50 px-6 py-3 rounded-lg text-center font-medium text-slate-800 dark:text-slate-200 transition-transform hover:-translate-y-1 hover:shadow-md">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-white via-zinc-400 to-white dark:from-black dark:via-zinc-800 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center relative">
            <span className="bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600 bg-clip-text text-transparent">Get In Touch</span>
            <div className="absolute w-24 h-1 bg-black dark:bg-white  left-1/2 transform -translate-x-1/2 mt-2"></div>
          </h2>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600 bg-clip-text text-transparent">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center group">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Mail size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">erichyzhou@gmail.com</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Code size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <a href="https://github.com/ericzhou12" target="https://github.com/ericzhou12" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">github.com/ericzhou12</a>
                  </div>
                  <div className="flex items-center group">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <User size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <a href="https://www.linkedin.com/in/erichyzhou/" target="https://www.linkedin.com/in/erichyzhou/" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">linkedin.com/in/erichyzhou</a>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-lg">
                  <h4 className="font-medium mb-2 text-slate-800 dark:text-white">Availability</h4>
                  <p className="text-slate-600 dark:text-slate-300">I'm currently available for freelance work, part-time opportunities, and remote internships. I will respond as soon as I can (<span>&#60;</span>24 hrs)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-300">&copy; {new Date().getFullYear()} Eric Zhou. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Code size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <User size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}