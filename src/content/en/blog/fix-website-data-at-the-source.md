---
title: "Website Content Errors: Check the Data Source Before Fixing the Page"
description: "A category page kept showing items that didn't belong. Patching the template hid the symptom until it returned two weeks later. How to trace content errors to their data source."
pubDate: 2026-11-16
updatedDate:
tags: [website-operations, data-quality, web-development]
category: work
draft: false
---

Late on a Friday afternoon, a colleague sent me a screenshot. The third row of a category page showed an item that clearly did not belong there. Under the image she had written one line: how did this get in.

I opened the list component, found the loop, and added a check. If the category field did not match the current page, skip the item. I refreshed. The row was gone. I sent the screenshot back. Fixed, as far as anyone could tell, in under twenty minutes.

Two weeks later a different list page had a similar problem. This time a card carried a brand name that had nothing to do with anything we sell. I went to add another check and stopped with my hands on the keyboard. This site renders the same data in a category page, a listing page, search results, the homepage, and two language versions. That is seven or eight places. One check each, plus one more every time we add a page, and nobody would ever dare delete any of them.

So I left the template alone and went looking for where the data came from.

## Following the field backwards

The content on this site is not written into the templates. It is read from a structured data source. The operations team maintains records in a sheet: name, category, tags, a description, an image. Pages filter by category. Tags decide which tag pages a record appears on.

Walking back from the page, I ended up at a mapping table. It was built during the first bulk import, and it converted each supplier's original product name into the name and category we use on the site. About forty rows. Some of those mappings had been reclassified six months earlier, and the table was never updated. So those records kept sitting under a category they no longer belonged to.

On the page it looked like content wandering in from nowhere. In the data it was an old mapping that nobody had reason to look at again.

Deleting those rows took less than a minute.

If I had kept adding checks to the template, though, they would still be sitting in that table, and every data sync would carry a fresh batch of them back in. Next time they would surface on a different page.

## Why the page is always the first instinct

I have thought about this. The page is visible. A screenshot points at an exact spot. A change can be verified with a refresh. You can send a screenshot back and close the loop in one exchange.

Data is not like that. It sits in a sheet or a JSON file, and before you can change it you have to explain that the problem is not the page. That explanation is hard to land in the moment. The other person is looking at a broken page. You are telling them the data is broken, which sounds like a way of saying it is not your problem.

There is a more practical reason too. Fixing the page means opening one file. Fixing the data means first working out which places consume that data. Ten minutes against half a day.

Half a day, weighed against eight checks scattered across the site, is the better trade.

## When the field does not say what it means

The same site had a harder problem than a misplaced record.

The product listing held more than eighty vehicle models, all rendered through one card component, each with an inquiry button at the bottom. Most of them were not stock. They were reference builds, configurations we had put together for a specific requirement. A customer would click through and ask what this one costs, and sales would have to answer that it is no longer available, or that it would have to be quoted again from scratch.

Operations was clear about it. These are examples, not inventory. But in the data they shared a single type with the real products and nearly the same fields. The only difference was one sentence in the description. The template cannot read that sentence and decide. It renders everything the same way, so a case study gets an inquiry button and a price-shaped promise it cannot keep.

No amount of condition-writing in the template fixes that, because the template is not missing a rule. It is missing a fact. We added a type field with three values: information, reference, and in stock. Operations has to pick one when entering a record, and a wrong choice is visible at entry instead of six weeks later on a live page. Reference cards render without the inquiry button.

Adding the field was easy. A dropdown. The hard part was going back through the existing records and deciding which type each one was. That took over a week. A few I could not call on my own, so I asked operations, and there were two they had to argue about between themselves.

## The pages I opened afterwards

The trouble with fixing data is that you change one place and affect many.

After the mapping cleanup I opened the related pages one by one. Category pages in both languages. A few keywords typed into search, to see whether the results still made sense. Tag pages. The homepage entry points. Then the edge cases: a category with a single record left in it, a filter that returns nothing, whether the empty state still held its layout or collapsed.

None of that is difficult. Miss one and it comes back as a screenshot.

One part I still do not do well: judging how far the impact reaches. The data is reused, but the paths it travels are not written down anywhere. I work from memory and from searching the code. That holds while a project is small. It stops holding once it is not.

## Where I have landed

These days my first question is where the record came in.

Most of the time the answer is not on the page. It is at the point of entry, in a mapping table nobody remembers the reason for, in a field whose meaning changed once and was never announced.

Patching the page is not forbidden. When something is broken on a Friday afternoon, patch it. Just go back and look at the data afterwards. Otherwise it will find another page and do this again.
