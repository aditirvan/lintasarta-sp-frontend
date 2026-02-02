export const createErrorMessage = (element, validate) => {
  const errorMessage = validate[element].$errors.length
    ? validate[element].$errors[0].$message
    : "";
  return errorMessage
}

export function isLimitError(string) {
    return string.includes("Quota but you only have") || string.includes("because current used is");
}

export function createLimitErrorMsg(string) {
  let result;
  let regex = /You need \d+ (.+?) Quota but you only have \d+/;
  const match = string.match(regex);
  result = match ? match[1] : null;

  if (!result) {
    regex = /You cant set (.+?) to \d+ because current used is \d+/;
    let match = string.match(regex);
    result = match ? match[1] : null;
  }
  if (result === "") {
    return "The resource has been reached the limit. Please contact the administrator.";
  }
  return `${result} has been reached the limit. Please contact the administrator.`;
}
