const r={python:{path:"python",language:"python"},java:{path:"java",language:"java"},javascript:{path:"javascript",language:"javascript"},js:{path:"javascript",language:"javascript"},typescript:{path:"javascript",language:"typescript"},"c++":{path:"cpp",language:"cpp"},cpp:{path:"cpp",language:"cpp"},c:{path:"c",language:"c"},"c#":{path:"csharp",language:"csharp"},csharp:{path:"csharp",language:"csharp"},ruby:{path:"ruby",language:"ruby"},php:{path:"php",language:"php"},swift:{path:"swift",language:"swift"},kotlin:{path:"kotlin",language:"kotlin"},go:{path:"go",language:"go"},golang:{path:"go",language:"go"},rust:{path:"rust",language:"rust"},scala:{path:"scala",language:"scala"},perl:{path:"perl",language:"perl"},r:{path:"r",language:"r"},matlab:{path:"matlab",language:"matlab"},html:{path:"html",language:"html"},css:{path:"css",language:"css"},sql:{path:"sql",language:"sql"},mysql:{path:"mysql",language:"sql"},postgresql:{path:"postgresql",language:"sql"},algorithm:{path:"algorithm",language:"pseudocode"},algorithms:{path:"algorithm",language:"pseudocode"},"data structure":{path:"ds",language:"pseudocode"},"data structures":{path:"ds",language:"pseudocode"}};async function h(a){try{const t=a.toLowerCase();let e=null;for(const[i,o]of Object.entries(r))if(t.includes(i)){e=o;break}if(!e)return null;const s=`https://www.alphacodingskills.com/${e.path}/index.php`;return{title:`${n(e.language)} Programming Tutorial - AlphaCodingSkills`,content:`Complete guide and interactive tutorials for ${n(e.language)} programming. Learn from basics to advanced concepts with practical examples.`,url:s,category:"Programming Tutorial",language:e.language,sections:l(e.language,a),examples:p(e.language),relatedTopics:g(e.language)}}catch(t){return console.error("Error creating AlphaCoding article:",t),null}}function n(a){return a.charAt(0).toUpperCase()+a.slice(1)}function l(a,t){return[{heading:"Introduction",content:`AlphaCodingSkills provides comprehensive ${a} programming tutorials with interactive examples and detailed explanations. This resource is designed for both beginners and experienced developers looking to enhance their ${a} skills.`},{heading:"What You Will Learn",content:`Fundamentals: Basic syntax, data types, and variables

Control Flow: Conditional statements and loops

Functions: Creating and using functions/methods

Object-Oriented Programming: Classes, objects, and inheritance

Advanced Topics: Decorators, generators, async programming

Best Practices: Code optimization and design patterns

Practical Projects: Real-world applications and examples`},{heading:"Interactive Learning",content:`The AlphaCodingSkills platform offers:

Live Code Editor: Write and run code directly in your browser

Step-by-Step Examples: Detailed explanations with code samples

Practice Exercises: Test your knowledge with coding challenges

Visual Diagrams: Understand concepts through visual representations

Quiz Questions: Self-assessment to track your progress`},{heading:"Topics Covered",content:c(a)},{heading:"Why Choose AlphaCodingSkills",content:`Free Access: All tutorials and examples are completely free

Comprehensive Coverage: From basics to advanced topics

Interactive Examples: Run code directly in your browser

Practical Focus: Real-world examples and use cases

Mobile Friendly: Learn on any device, anywhere

Regular Updates: Content updated with latest standards`}]}function c(a){return{python:`• Python Installation and Setup
• Variables and Data Types
• Operators and Expressions
• Control Flow (if, elif, else)
• Loops (for, while)
• Functions and Lambda
• Lists, Tuples, Sets, Dictionaries
• String Manipulation
• File Handling
• Object-Oriented Programming
• Modules and Packages
• Exception Handling
• Regular Expressions
• Database Connectivity
• Web Scraping
• GUI Programming`,java:`• Java Environment Setup
• Variables and Data Types
• Operators
• Control Statements
• Arrays and Strings
• Methods
• Object-Oriented Concepts
• Inheritance and Polymorphism
• Interfaces and Abstract Classes
• Exception Handling
• Collections Framework
• File I/O
• Multithreading
• JDBC Database Connectivity
• JavaFX GUI
• Design Patterns`,javascript:`• JavaScript Basics
• Variables (var, let, const)
• Data Types
• Operators
• Control Flow
• Functions and Arrow Functions
• Arrays and Objects
• DOM Manipulation
• Events and Event Handling
• Promises and Async/Await
• ES6+ Features
• Closures and Scope
• Prototypes and Inheritance
• JSON and AJAX
• Modules
• Error Handling`}[a]||`• Fundamentals and Syntax
• Data Types and Variables
• Control Structures
• Functions and Methods
• Object-Oriented Programming
• Error Handling
• Advanced Topics
• Best Practices`}function p(a){return{python:[{title:"Hello World",code:`# Python Hello World
print("Hello, World!")

# Variables and Data Types
name = "Gigabase"
version = 1.0
is_active = True

print(f"Welcome to {name} v{version}")`,language:"python",explanation:"Basic Python syntax including print statements, variables, and string formatting."},{title:"Functions and Loops",code:`# Function definition
def greet(name):
    return f"Hello, {name}!"

# List iteration
names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(greet(name))

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]`,language:"python",explanation:"Demonstrates functions, loops, and list comprehensions in Python."}],java:[{title:"Hello World",code:`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Variables
        String name = "Gigabase";
        double version = 1.0;
        boolean isActive = true;
        
        System.out.println("Welcome to " + name + " v" + version);
    }
}`,language:"java",explanation:"Basic Java program structure with main method and variables."}],javascript:[{title:"Hello World",code:`// JavaScript Hello World
console.log("Hello, World!");

// Variables
const name = "Gigabase";
let version = 1.0;
var isActive = true;

console.log(\`Welcome to \${name} v\${version}\`);

// Arrow Function
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("Developer"));`,language:"javascript",explanation:"Modern JavaScript with const/let, template literals, and arrow functions."}]}[a]||[]}function g(a){return{python:[{title:"Python Introduction",slug:"python-introduction",description:"Getting started with Python programming"},{title:"Python Syntax",slug:"python-syntax",description:"Learn Python syntax and basic structure"},{title:"Python Variables",slug:"python-variables",description:"Understanding variables and data types"},{title:"Python Functions",slug:"python-functions",description:"Creating and using functions"},{title:"Python Classes",slug:"python-classes",description:"Object-oriented programming in Python"}],java:[{title:"Java Introduction",slug:"java-introduction",description:"Getting started with Java programming"},{title:"Java Syntax",slug:"java-syntax",description:"Learn Java syntax and basic structure"},{title:"Java Variables",slug:"java-variables",description:"Understanding variables and data types"},{title:"Java Methods",slug:"java-methods",description:"Creating and using methods"},{title:"Java Classes",slug:"java-classes",description:"Object-oriented programming in Java"}],javascript:[{title:"JavaScript Introduction",slug:"javascript-introduction",description:"Getting started with JavaScript"},{title:"JavaScript Syntax",slug:"javascript-syntax",description:"Learn JavaScript syntax and basic structure"},{title:"JavaScript Variables",slug:"javascript-variables",description:"Understanding var, let, and const"},{title:"JavaScript Functions",slug:"javascript-functions",description:"Functions and arrow functions"},{title:"JavaScript Objects",slug:"javascript-objects",description:"Working with objects and classes"}]}[a]||[]}export{h as extractAlphaCodingArticle};
