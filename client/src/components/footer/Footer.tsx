'use client';
import LogoFull from '@/assets/svg components/LogoFull';
import { Button, Input, Link } from '@heroui/react';

export default function Footer() {
  return (
    <footer className="w-full  bg-default/40 flex flex-col">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 md:pr-8">
            <div className="flex items-center justify-start">
              <LogoFull className="fill-foreground h-6" />
            </div>
            <p className="text-small text-default-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque
              elit, tristique
            </p>
            <div className="flex space-x-6">
              {/* Social media icons here */}
            </div>
          </div>
        </div>
        <LinkGrid />
        <div className="rounded-medium bg-default-200/20 my-10 p-4 sm:my-14 sm:p-8 lg:my-16 lg:flex lg:items-center lg:justify-between lg:gap-2">
          <div>
            <h3 className="text-small text-default-600 font-semibold">
              Subscribe to our newsletter
            </h3>
            <p className="text-small text-default-400 mt-2">
              Receive weekly updates with the newest insights, trends, and
              tools, straight to your email.
            </p>
          </div>
          <form
            className="mt-6 sm:flex sm:max-w-md lg:mt-0"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input type="email" placeholder="Enter your email" fullWidth />
            <div className="mt-4 sm:mt-0 sm:ml-4 sm:shrink-0">
              <Button color="primary">Submit</Button>
            </div>
          </form>
        </div>
        <div className="flex flex-wrap justify-between gap-2 pt-8">
          <p className="text-small text-default-400">
            © 2024 Acme Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function LinkGrid() {
  return (
    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
          <div>
            <h3 className="text-small text-default-600 font-semibold">
              Services
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Branding
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Data Analysis
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  E-commerce Solutions
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Market Research
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 md:mt-0">
          <div>
            <h3 className="text-small text-default-600 font-semibold">
              Support
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  User Guides
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Service Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
          <div>
            <h3 className="text-small text-default-600 font-semibold">
              About Us
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Latest News
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Career Opportunities
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Media Enquiries
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Collaborations
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 md:mt-0">
          <div>
            <h3 className="text-small text-default-600 font-semibold">Legal</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Claim
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  className="text-default-400 cursor-pointer text-small"
                  href="#"
                >
                  User Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
