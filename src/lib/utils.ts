/**
 * Utility Functions
 */

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function unslugify(slug: string): string {
  return slug.split("-").map(capitalizeWords).join(" ");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export interface ScrollToOptions {
  behavior?: "smooth" | "auto";
  offset?: number;
}

export function scrollToElement(
  selector: string,
  options: ScrollToOptions = {}
): void {
  const element = document.querySelector(selector);
  if (!element) return;

  const { behavior = "smooth", offset = 80 } = options;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior });
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return re.test(phone.replace(/\s/g, ""));
}
