import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { kitOptInForms, missingRequiredOptInFields } from "./optin-fields.mjs";

const firstName = '<input class="formkit-input" name="fields[first_name]" type="text" required data-hj-suppress>';
const email = '<input class="formkit-input" name="email_address" type="email" required data-hj-suppress>';

const optIn = (...inputs) =>
  `<form action="https://app.kit.com/forms/9960166/subscriptions" method="post">${inputs.join("")}<button type="submit">Join</button></form>`;

test("an opt-in passes only when First Name and Email are both required", () => {
  assert.deepEqual(missingRequiredOptInFields(optIn(firstName, email)), []);
  assert.deepEqual(missingRequiredOptInFields(optIn(firstName.replace(" required", ""), email)), ["fields[first_name]"]);
  assert.deepEqual(missingRequiredOptInFields(optIn(email)), ["fields[first_name]"]);
  assert.deepEqual(missingRequiredOptInFields(optIn(firstName, email.replace(" required", ""))), ["email_address"]);
  assert.deepEqual(missingRequiredOptInFields(optIn()), ["fields[first_name]", "email_address"]);
});

test("a look-alike attribute does not satisfy the requirement", () => {
  for (const decoy of ['data-required="true"', 'aria-required="true"', 'placeholder="required"']) {
    const tag = firstName.replace(" required", ` ${decoy}`);
    assert.deepEqual(missingRequiredOptInFields(optIn(tag, email)), ["fields[first_name]"], decoy);
  }
  // required="required" is the spelled-out form of the same attribute.
  assert.deepEqual(missingRequiredOptInFields(optIn(firstName.replace(" required", ' required="required"'), email)), []);
});

test("only Kit subscription forms are held to the rule, and each is reported by form id", () => {
  const search = '<form action="/search" method="get"><input name="q" type="search"></form>';
  const newsletter = optIn(firstName, email).replace("9960166", "9916003");
  const forms = kitOptInForms(`<main>${search}${newsletter}${optIn(email)}</main>`);
  assert.deepEqual(forms.map(({ formId }) => formId), ["9916003", "9960166"]);
  assert.deepEqual(forms.map(({ form }) => missingRequiredOptInFields(form)), [[], ["fields[first_name]"]]);
  assert.deepEqual(kitOptInForms(search), []);
});

test("both shipped opt-in templates require First Name and Email", () => {
  for (const include of ["newsletter-signup", "leadmagnet-signup"]) {
    const template = readFileSync(`src/_includes/${include}.njk`, "utf8");
    assert.doesNotMatch(template, /optional/i, include);
    const [form, ...rest] = kitOptInForms(template.replace(/\{\{ magnet\.formId \}\}/g, "9960166"));
    assert.equal(rest.length, 0, include);
    assert.deepEqual(missingRequiredOptInFields(form.form), [], include);
  }
});
