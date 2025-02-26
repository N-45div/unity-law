type QuestionType = "Text" | "Number" | "Logic Y/N" | "Unknown";

export const textTypes: { [key: string]: string } = {
  "Employer Name": "What's the name of the employer?",
  "Registered Address": "What's the registered address?",
  "Employee Name": "What's the name of the employee?",
  "Employee Address": "What's the employee's address?",
  "Employment Start Date": "What's the employment start date?",
  "Previous Employment Start Date": "What's the previous employment start date?",
  "Job Title": "What's the name of the job title?",
  "Reporting Manager": "What's the name of the reporting manager?",
  "Brief Description of Duties": "What's the description of duties?",
  "Workplace Address": "What's the workplace address?",
  "Days of Work": "What's the days of work?",
  "Start Time": "When is the start time?",
  "End Time": "When is the end time?",
  "Payment Frequency": "What's the payment frequency?",
  "Payment Date": "When is the payment date?",
  "Details of Company Sick Pay Policy": "What's the sick pay policy?",
  "HR/Relevant Contact": "What's the name of HR/relevant contact?",
  "Notice Period": "What's the notice period?",
  "Company Handbook/HR": "What's the company handbook?",
  "Authorized Representative": "What's the name of the representative?",
  "Date": "What's the date?",
};

export const numberTypes: { [key: string]: string } = {
  "Probation Period Length": "What's the probation period length?",
  "Probation Extension Length": "What's the probation extension length?",
  "one week's": "How many weeks?",
  "Overtime Pay Rate": "What's the overtime pay rate?",
  "Annual Salary": "What's the annual salary?",
  "Holiday Entitlement": "What's the holiday entitlement?",
};

export const radioTypes: { [key: string]: string } = {
  "Previous Employment Start Date": "Is the previous service applicable?",
  "Probation Period Length": "Is the clause of probationary period applicable?",
  "Overtime Pay Rate": "Is the overtime payment applicable?",
  "Details of Company Sick Pay Policy": "Is the sick pay policy applicable?",
};

export const determineQuestionType = (text: string): { 
  primaryType: QuestionType, 
  primaryValue: string, 
  validTypes: QuestionType[], 
  alternateType?: QuestionType, 
  alternateValue?: string 
} => {
  let primaryType: QuestionType = "Unknown";
  let primaryValue: string = "";
  let validTypes: QuestionType[] = [];
  let alternateType: QuestionType | undefined;
  let alternateValue: string | undefined;

  // Check text types
  if (textTypes.hasOwnProperty(text)) {
    primaryType = "Text";
    primaryValue = textTypes[text];
    validTypes.push("Text");
  }

  // Check number types
  if (numberTypes.hasOwnProperty(text)) {
    primaryType = "Number";
    primaryValue = numberTypes[text];
    validTypes.push("Number");
  }

  // Check radio types
  if (radioTypes.hasOwnProperty(text)) {
    if (primaryType === "Unknown") {
      primaryType = "Logic Y/N";
      primaryValue = radioTypes[text];
    } else {
      alternateType = "Logic Y/N";
      alternateValue = radioTypes[text];
    }
    validTypes.push("Logic Y/N");
  }

  // If no valid type is found, return Unknown
  if (validTypes.length === 0) {
    return { primaryType: "Unknown", primaryValue: "", validTypes: [] };
  }

  return { primaryType, primaryValue, validTypes, alternateType, alternateValue };
};