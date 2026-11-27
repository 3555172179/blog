---
title: "New Website First Week Checklist:What to Check After Launch"
description: "A practical first week checklist for a new independent website launch. Covers broken links, page speed, mobile layout, contact form tests, search console setup, and simple traffic checks without brand names."
pubDate: 2026-11-19
updatedDate:
tags: [foreign-trade-notes]
category: work
draft: false
---

The site had gone live at midnight. I had spent three weeks building it, testing product pages on a staging URL, checking image compression, and rewriting the About page four times. By the time it was live, I realized I had no idea what to check first.

I opened the homepage on my phone. It loaded. Then I clicked the main menu. One of the dropdown items pointed to a 404 page. That was the moment I understood that launching a site is not the finish line. It is the first time the site meets real browsers, real screen sizes, and real users who will not tell you what is broken. They just leave.

## Start With Links, Not Analytics

My first mistake was opening the traffic dashboard before checking basic functionality. The dashboard showed one visitor, probably me. That told me nothing. What actually mattered was whether a customer could move from the homepage to a category page to a product page and then to the checkout without hitting a dead end.

I spent the first afternoon clicking every link in the main navigation, footer, and homepage banners. I found seven broken links. Six of them were internal links I had changed during development but forgotten to update. One was an external link to a shipping policy that no longer existed. Fixing these took an hour. Ignoring them would have cost real orders later.

## Test the Contact Form With a Real Email Address

On day two, I filled out my own contact form. I used a personal Gmail address, not the company email. The form said "message sent" but nothing arrived. The SMTP settings were wrong. A customer who wrote to me on day one would have thought I ignored them. That is worse than a broken link because it breaks trust.

I fixed the email settings and tested again. The message arrived in three minutes. Then I tested the form on my phone. The submit button was half hidden behind the keyboard on one screen size. I had to adjust the padding. Small things like this are invisible in a desktop preview but obvious on a real device.

## Check Page Speed on a Slow Connection

I had been testing the site on office Wi-Fi with 200 megabit speed. Everything loaded instantly. Then I switched my phone to 4G with one bar of signal in the parking lot behind the warehouse. The homepage took 11 seconds to load. The hero image was 2.4 megabytes. That is a customer lost before the page finishes rendering.

I compressed the hero image down to 300 kilobytes and removed a slider plugin I was not using. The load time dropped to 4 seconds. Still not perfect, but acceptable for a first week. The goal was not to win a speed award. The goal was to stop losing customers before they saw a single product.

## Set Up Search Console on Day One

I delayed this for two days because I thought it was a technical chore. That was a mistake. Google Search Console does not show much data in the first week, but it shows crawl errors. It showed that Googlebot could not access three pages because of a robots.txt rule I had copied from a template. The template blocked a folder that did not need blocking. Without Search Console, I would have found this out weeks later, after losing organic indexing time.

Submitting the sitemap took two minutes. The first crawl happened the next morning. By day five, Google had indexed 14 pages. Not impressive, but it meant the site was technically visible. That is the foundation.

## Look at Mobile Layout on Real Devices

I do not own an iPhone. I tested on an Android phone and a small tablet. A friend tested on her iPhone. The product grid looked fine on Android but broke into a single narrow column on her iPhone 13 Mini. The CSS grid had a minimum width that did not account for smaller screens. I changed one line of CSS and the layout fixed itself.

This is why a preview tool is not enough. Real devices have different notch sizes, different browser toolbars, different default font sizes. If you cannot borrow a friend's phone, use a browser dev tool, but know that it is an approximation.

## Check What a Stranger Sees, Not What You See

By Friday, I had fixed 14 issues. Broken links, the contact form, image sizes, a missing favicon, a typo in the footer, a checkout button that said "Continue" instead of "Place Order". Each fix took between five minutes and an hour. None of them required deep technical skill. What they required was looking at the site the way a customer would, not the way a builder would.

The last thing I checked was the page title and meta description on a Google search result. I searched for my own site name. The title was cut off at 58 characters. The description was a generic line from the template. I rewrote both. That small change will not bring traffic by itself, but it is the first thing a searcher sees. A broken title looks unprofessional.

I did not finish the first week checklist. I just ran out of obvious things to break. The site still has problems I have not found yet. But the first week taught me that checking is not a one-time task. It is a habit. The site went live on Monday. By Sunday, it was not perfect, but it was no longer embarrassing.
