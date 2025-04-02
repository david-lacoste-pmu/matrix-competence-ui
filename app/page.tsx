"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Check, Star, Menu, X } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-primary text-primary-foreground px-3 py-1 rounded-md mr-2">PMU</span>
                <span className="text-xl font-semibold text-gray-900">Matrix</span>
              </Link>
              <div className="hidden md:ml-10 md:block">
                <div className="flex space-x-8">
                  <Link href="#features" className="text-base font-medium text-gray-700 hover:text-primary">
                    Features
                  </Link>
                </div>
              </div>
            </div>
            <div className="ml-10 space-x-4 flex items-center">
              <Link href="/login" className="hidden md:inline-block text-base font-medium text-gray-700 hover:text-primary">
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white">
            <div className="fixed inset-0 flex">
              <div className="relative w-full">
                <div className="flex h-16 items-center justify-between px-6">
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold bg-primary text-primary-foreground px-3 py-1 rounded-md mr-2">PMU</span>
                    <span className="text-xl font-semibold text-gray-900">Matrix</span>
                  </Link>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 flow-root px-6">
                  <div className="space-y-6 py-6">
                    <Link
                      href="#features"
                      className="block text-base font-medium text-gray-900 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                  </div>
                  <div className="space-y-4 py-6">
                    <Link
                      href="/login"
                      className="block text-base font-medium text-gray-900 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-20">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
              <div className="mt-4 sm:mt-6 mb-8">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                  New features released
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Elevate Your Team's Excellence with PMU Matrix
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Unlock the full potential of your workforce with our comprehensive skills matrix management. Track competencies, manage teams, and build high-performing organizations.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Get started
                </Link>
                <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 flex items-center">
                  Explore features <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-16">
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <div className="relative rounded-xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
                  <svg 
                    className="w-full h-auto" 
                    width="1080" 
                    height="675" 
                    viewBox="0 0 1080 675" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="1080" height="675" fill="#e2e8f0"/>
                    <text x="540" y="337.5" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontFamily="sans-serif" fontSize="36px">
                      Dashboard Preview
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Powerful Features</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage team competencies
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our comprehensive platform helps you track skills, manage teams, and develop talent across your organization.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    Competence Matrix
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Visualize your team's skill levels with our intuitive matrix view. Identify strengths and gaps to make informed decisions.
                  </dd>
                </div>

                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    Team Management
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Create and manage teams effortlessly. Group members by projects, departments, or skills to optimize your workflow.
                  </dd>
                </div>

                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    Skill Assessment
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Evaluate and track team members' competencies with customizable assessment levels and detailed feedback.
                  </dd>
                </div>

                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                      </svg>
                    </div>
                    Analytics & Reports
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Generate detailed reports to identify trends, gaps, and progress. Make data-driven decisions for training and development.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by organizations worldwide
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Discover how teams use PMU Matrix to transform their skill management processes.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 stroke-none" />
                      ))}
                    </div>
                    <div className="mt-6 text-base leading-7 text-gray-600">
                      <p>"{testimonial.quote}"</p>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-600">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary">
          <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to take control of your team's competence management?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Start using PMU Matrix today and unlock the full potential of your team members.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/dashboard"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started for free
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-4">
            {['About', 'Blog', 'Jobs', 'Privacy', 'Terms', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-sm leading-6 text-gray-600 hover:text-primary">
                {item}
              </a>
            ))}
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} PMU Matrix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Testimonial data
const testimonials = [
  {
    quote: "PMU Matrix has transformed how we manage our team's skills. We now have clear visibility into our strengths and areas for development.",
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechGrowth Inc."
  },
  {
    quote: "The competence matrix feature has been a game-changer for our resource allocation. We can now assign the right people to the right projects.",
    name: "Michael Chen",
    role: "Project Manager",
    company: "Innovate Solutions"
  },
  {
    quote: "Easy to use and powerful reporting. PMU Matrix has helped us identify training needs and develop targeted learning plans for our team.",
    name: "Emma Rodriguez",
    role: "Learning & Development",
    company: "Global Services Ltd"
  }
];