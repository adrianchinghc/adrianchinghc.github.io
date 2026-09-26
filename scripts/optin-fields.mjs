// Every newsletter and lead-magnet opt-in asks for First Name and Email, and
// both are required. Kit only enforces email_address on its side, so the
// `required` attribute in our own markup is the control a reader actually
// meets. check-site.mjs runs these over rendered HTML, which covers any future
// opt-in on any page rather than the two includes we happen to have today.

const kitSubscribeAction = /\baction="https:\/\/app\.kit\.com\/forms\/(\d+)\/subscriptions"/;

// Kit posts the email as email_address and every other answer as fields[name].
export const requiredOptInFields = ["fields[first_name]", "email_address"];

export function kitOptInForms(html) {
  return [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].flatMap((match) => {
    const formId = match[0].match(kitSubscribeAction)?.[1];
    return formId ? [{ formId, form: match[0] }] : [];
  });
}

function requiresField(form, name) {
  return [...form.matchAll(/<input\b[^>]*>/g)].some((match) =>
    // `\s+required` before a boundary keeps data-required and aria-required out.
    match[0].includes(`name="${name}"`) && /\s+required(?=[\s>=])/.test(match[0])
  );
}

export function missingRequiredOptInFields(form) {
  return requiredOptInFields.filter((name) => !requiresField(form, name));
}
