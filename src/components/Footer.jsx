import { Github, Linkedin, Mail } from 'lucide-react'
import Card from '../components/Card'

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4 text-primary-500">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-300">Features</a></li>
              <li><a href="#" className="hover:text-gray-300">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-300">Security</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-primary-500">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-300">About</a></li>
              <li><a href="#" className="hover:text-gray-300">Blog</a></li>
              <li><a href="#" className="hover:text-gray-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-primary-500">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-300">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-300">Terms</a></li>
              <li><a href="#" className="hover:text-gray-300">Cookie</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-primary-500 mb-1">GeoAttend</h3>
              <p className="text-sm text-gray-400">Smart GPS-based Attendance System</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            © 2024 GeoAttend. All rights reserved. | Made with ❤ by Samad Latkar
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
