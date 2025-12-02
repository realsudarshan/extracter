"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Extractor</span>
        </Link>

        {/* Navigation Links - Always Visible */}
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </button>
        </div>

        {/* Auth Buttons - Always Visible */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header;