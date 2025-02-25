type QuestionType = "Text" | "Number" | "Logic Y/N" | "Unknown";
export const determineQuestionType = (text: string): { type: QuestionType, value: string } => {
    const textTypes : { [key: string]: string } = {
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
        "End Time": "When is the end time", 
        "Payment Frequency": "What's the payment frequency?", 
        "Payment Date": "When is the payment date?",
        "Details of Company Sick Pay Policy": "What's the sick pay policy?", 
        "HR/Relevant Contact": "What's the name of HR/relevant contact?", 
        "Notice Period": "What's the notice period?",
        "Company Handbook/HR": "What's the company handbook?", 
        "Authorized Representative": "What's the name of the representative?", 
        "Date": "What's the date?",
    };

    const numberTypes : { [key: string]: string } = {
        "Probation Period Length": "What's the probation period length?", 
        "Probation Extension Length": "What's the probation entension length?", 
        "one week's": "How many weeks?",
        "Overtime Pay Rate": "What's the overtime pay rate?", 
        "Annual Salary": "What's the annual salary?", 
        "Holiday Entitlement": "What's the holiday entitlement?",
    };

    const radioTypes: { [key: string]: string } = {
        "on [Previous Employment Start Date] with previous continuous service taken into account": "Is the previous service applicable?",
        "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.": "Is the clause of probationary period applicable?",
        "The Employee shall not receive additional payment for overtime worked": "Is the overtime payment applicable?",
        "The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy]": "Is the sick pay policy applicable?",
        'or, if applicable, "on [Previous Employment Start Date] with previous continuous service taken into account"': "Is the previous service applicable?"
    
    }
    
    if (textTypes.hasOwnProperty(text)) {
        return { type: "Text", value: textTypes[text] };
    }
    if (numberTypes.hasOwnProperty(text)) {
        return { type: "Number", value: numberTypes[text] };
    }
    if (radioTypes.hasOwnProperty(text)) {
        return { type: "Logic Y/N", value: radioTypes[text] };
    }
    return { type: "Unknown", value: "" };
};
