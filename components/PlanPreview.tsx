"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ExternalLink, Image as ImageIcon, Calendar, Target } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Types
interface Resource {
  label: string
  url: string
}

interface TaskDetails {
  description: string
  resources: Resource[]
  screenshot?: string
}

interface DayTask {
  day: number
  task: string
  details: TaskDetails
}

interface WeekPlan {
  week: number
  milestone: string
  days: DayTask[]
}

interface PlanPreviewProps {
  planData?: WeekPlan[]
  className?: string
}

// TaskItem Component for modularity
interface TaskItemProps {
  task: DayTask
  weekNumber: number
  isExpanded: boolean
  onToggle: () => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, weekNumber, isExpanded, onToggle }) => {
  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800/50 transition-all duration-200 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-sm font-semibold">
            {task.day}
          </div>
          <span className="text-white font-medium">{task.task}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-800">
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{task.details.description}</p>
                </div>

                {/* Resources */}
                {task.details.resources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Resources</h4>
                    <div className="space-y-2">
                      {task.details.resources.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
                          <span className="underline underline-offset-2">{resource.label}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screenshot */}
                {task.details.screenshot && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Preview</h4>
                    <div className="relative group">
                      <img
                        src={task.details.screenshot}
                        alt={`Screenshot for ${task.task}`}
                        className="w-full max-w-md rounded-lg border border-gray-700 transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback when image doesn't exist
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.nextSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                      <div 
                        className="hidden w-full max-w-md h-32 rounded-lg border border-gray-700 bg-gray-800 items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-sm">Preview not available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main PlanPreview Component
export const PlanPreview: React.FC<PlanPreviewProps> = ({ planData, className }) => {
  // Fake plan data simulation
  const [plan] = useState<WeekPlan[]>(
    planData || [
      {
        week: 1,
        milestone: "Learn Python Basics",
        days: [
          {
            day: 1,
            task: "Install Python & Set up IDE",
            details: {
              description: "Download Python from python.org and install VS Code with Python extension for a complete development environment.",
              resources: [
                { label: "Python.org", url: "https://www.python.org/downloads/" },
                { label: "VS Code", url: "https://code.visualstudio.com/" },
                { label: "Python Extension for VS Code", url: "https://marketplace.visualstudio.com/items?itemName=ms-python.python" }
              ],
              screenshot: "/images/python-install.png"
            }
          },
          {
            day: 2,
            task: "Understand variables and data types",
            details: {
              description: "Learn about strings, integers, floats, and booleans. Practice creating variables and understanding type conversion.",
              resources: [
                { label: "Python Data Types – W3Schools", url: "https://www.w3schools.com/python/python_datatypes.asp" },
                { label: "Real Python - Variables", url: "https://realpython.com/python-variables/" }
              ]
            }
          },
          {
            day: 3,
            task: "Practice basic input/output",
            details: {
              description: "Learn to use print() function and input() function to interact with users.",
              resources: [
                { label: "Python Input/Output", url: "https://docs.python.org/3/tutorial/inputoutput.html" }
              ]
            }
          },
          {
            day: 4,
            task: "Work with strings and string methods",
            details: {
              description: "Master string manipulation, formatting, and common string methods like split(), join(), strip(), etc.",
              resources: [
                { label: "Python String Methods", url: "https://docs.python.org/3/library/stdtypes.html#string-methods" },
                { label: "Real Python - Strings", url: "https://realpython.com/python-strings/" }
              ]
            }
          },
          {
            day: 5,
            task: "Lists and list operations",
            details: {
              description: "Understand lists, indexing, slicing, and basic list methods like append(), remove(), pop().",
              resources: [
                { label: "Python Lists Tutorial", url: "https://docs.python.org/3/tutorial/datastructures.html" },
                { label: "W3Schools - Python Lists", url: "https://www.w3schools.com/python/python_lists.asp" }
              ]
            }
          },
          {
            day: 6,
            task: "Dictionaries and key-value pairs",
            details: {
              description: "Learn about dictionaries, accessing values, adding/removing keys, and dictionary methods.",
              resources: [
                { label: "Python Dictionaries", url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" },
                { label: "Real Python - Dictionaries", url: "https://realpython.com/python-dicts/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 1 Practice Project",
            details: {
              description: "Build a simple calculator that performs basic arithmetic operations and stores results in a dictionary.",
              resources: [
                { label: "Calculator Project Guide", url: "https://www.geeksforgeeks.org/python-program-make-simple-calculator/" },
                { label: "Python Beginner Projects", url: "https://realpython.com/intermediate-python-project-ideas/" }
              ]
            }
          }
        ]
      },
      {
        week: 2,
        milestone: "Control Flow & Loops",
        days: [
          {
            day: 1,
            task: "If/Else statements and conditionals",
            details: {
              description: "Understand conditional branching in Python. Learn to use if, elif, and else statements for decision making.",
              resources: [
                { label: "Real Python - If Statements", url: "https://realpython.com/python-conditional-statements/" },
                { label: "Python If...Else", url: "https://www.w3schools.com/python/python_conditions.asp" }
              ]
            }
          },
          {
            day: 2,
            task: "For loops and iteration",
            details: {
              description: "Master for loops for iterating over sequences like lists, strings, and ranges.",
              resources: [
                { label: "Python For Loops", url: "https://realpython.com/python-for-loop/" },
                { label: "For Loop Examples", url: "https://www.w3schools.com/python/python_for_loops.asp" }
              ]
            }
          },
          {
            day: 3,
            task: "While loops and loop control",
            details: {
              description: "Learn while loops, break and continue statements, and avoiding infinite loops.",
              resources: [
                { label: "While Loops in Python", url: "https://realpython.com/python-while-loop/" },
                { label: "Loop Control Statements", url: "https://www.tutorialspoint.com/python/python_loop_control.htm" }
              ]
            }
          },
          {
            day: 4,
            task: "Nested loops and advanced iteration",
            details: {
              description: "Understand nested loops, enumerate(), zip(), and range() function with different parameters.",
              resources: [
                { label: "Python Nested Loops", url: "https://www.geeksforgeeks.org/python-nested-loops/" },
                { label: "enumerate() and zip()", url: "https://realpython.com/python-enumerate/" }
              ]
            }
          },
          {
            day: 5,
            task: "List comprehensions",
            details: {
              description: "Learn the Pythonic way to create lists using list comprehensions and when to use them.",
              resources: [
                { label: "List Comprehensions", url: "https://realpython.com/list-comprehension-python/" },
                { label: "Python List Comprehension", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" }
              ]
            }
          },
          {
            day: 6,
            task: "Exception handling basics",
            details: {
              description: "Introduction to try/except blocks and handling common exceptions in Python.",
              resources: [
                { label: "Python Exception Handling", url: "https://docs.python.org/3/tutorial/errors.html" },
                { label: "Real Python - Exceptions", url: "https://realpython.com/python-exceptions-handling/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 2 Practice Project",
            details: {
              description: "Create a number guessing game with input validation, loops, and exception handling.",
              resources: [
                { label: "Number Guessing Game Tutorial", url: "https://www.geeksforgeeks.org/python-program-for-simple-guessing-game/" },
                { label: "Input Validation in Python", url: "https://realpython.com/python-input-validation/" }
              ]
            }
          }
        ]
      },
      {
        week: 3,
        milestone: "Functions & Modules",
        days: [
          {
            day: 1,
            task: "Creating and using functions",
            details: {
              description: "Learn to define functions, pass parameters, and return values. Understand scope and best practices.",
              resources: [
                { label: "Python Functions", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
                { label: "Real Python - Functions", url: "https://realpython.com/defining-your-own-python-function/" }
              ]
            }
          },
          {
            day: 2,
            task: "Function parameters and arguments",
            details: {
              description: "Master different types of arguments: positional, keyword, default, *args, and **kwargs.",
              resources: [
                { label: "Python Function Arguments", url: "https://realpython.com/python-kwargs-and-args/" },
                { label: "Function Parameters Guide", url: "https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions" }
              ]
            }
          },
          {
            day: 3,
            task: "Lambda functions and map/filter",
            details: {
              description: "Learn anonymous functions, map(), filter(), and reduce() for functional programming.",
              resources: [
                { label: "Python Lambda Functions", url: "https://realpython.com/python-lambda/" },
                { label: "Map, Filter, Reduce", url: "https://www.geeksforgeeks.org/python-map-filter-reduce-functions/" }
              ]
            }
          },
          {
            day: 4,
            task: "Modules and packages",
            details: {
              description: "Understand how to create, import, and organize code using modules and packages.",
              resources: [
                { label: "Python Modules", url: "https://docs.python.org/3/tutorial/modules.html" },
                { label: "Real Python - Modules", url: "https://realpython.com/python-modules-packages/" }
              ]
            }
          },
          {
            day: 5,
            task: "Standard library exploration",
            details: {
              description: "Explore common standard library modules: os, sys, datetime, random, json, and urllib.",
              resources: [
                { label: "Python Standard Library", url: "https://docs.python.org/3/library/" },
                { label: "Essential Standard Modules", url: "https://realpython.com/python-modules-packages/" }
              ]
            }
          },
          {
            day: 6,
            task: "File handling and I/O operations",
            details: {
              description: "Learn to read from and write to files, handle different file formats, and manage file paths.",
              resources: [
                { label: "Python File I/O", url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" },
                { label: "Real Python - Files", url: "https://realpython.com/python-file-handling/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 3 Practice Project",
            details: {
              description: "Build a personal expense tracker that reads/writes data to files and uses multiple functions.",
              resources: [
                { label: "Expense Tracker Project", url: "https://www.geeksforgeeks.org/expense-tracker-application-in-python/" },
                { label: "CSV File Handling", url: "https://realpython.com/python-csv/" }
              ]
            }
          }
        ]
      },
      {
        week: 4,
        milestone: "Object-Oriented Programming Basics",
        days: [
          {
            day: 1,
            task: "Introduction to classes and objects",
            details: {
              description: "Understand the fundamentals of OOP, creating classes, and instantiating objects.",
              resources: [
                { label: "Python Classes Tutorial", url: "https://docs.python.org/3/tutorial/classes.html" },
                { label: "Real Python - OOP", url: "https://realpython.com/python3-object-oriented-programming/" }
              ]
            }
          },
          {
            day: 2,
            task: "Attributes and methods",
            details: {
              description: "Learn about instance variables, class variables, and different types of methods.",
              resources: [
                { label: "Python Attributes", url: "https://realpython.com/python-classes/" },
                { label: "Instance vs Class Variables", url: "https://www.geeksforgeeks.org/python-class-instance-attributes/" }
              ]
            }
          },
          {
            day: 3,
            task: "Constructor and destructor methods",
            details: {
              description: "Master __init__, __del__, and other special methods for object lifecycle management.",
              resources: [
                { label: "Python Special Methods", url: "https://docs.python.org/3/reference/datamodel.html#special-method-names" },
                { label: "Constructor in Python", url: "https://www.geeksforgeeks.org/constructors-in-python/" }
              ]
            }
          },
          {
            day: 4,
            task: "Encapsulation and access modifiers",
            details: {
              description: "Learn about public, protected, and private attributes using naming conventions.",
              resources: [
                { label: "Python Encapsulation", url: "https://www.geeksforgeeks.org/encapsulation-in-python/" },
                { label: "Access Modifiers", url: "https://realpython.com/python-getter-setter/" }
              ]
            }
          },
          {
            day: 5,
            task: "Class inheritance fundamentals",
            details: {
              description: "Understand inheritance, parent-child relationships, and method overriding.",
              resources: [
                { label: "Python Inheritance", url: "https://docs.python.org/3/tutorial/classes.html#inheritance" },
                { label: "Inheritance Tutorial", url: "https://realpython.com/inheritance-composition-python/" }
              ]
            }
          },
          {
            day: 6,
            task: "Polymorphism and method overriding",
            details: {
              description: "Learn about polymorphism, super() function, and dynamic method resolution.",
              resources: [
                { label: "Python Polymorphism", url: "https://www.geeksforgeeks.org/polymorphism-in-python/" },
                { label: "Super() Function", url: "https://realpython.com/python-super/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 4 Practice Project",
            details: {
              description: "Create a library management system with books, members, and transactions using OOP principles.",
              resources: [
                { label: "Library Management System", url: "https://www.geeksforgeeks.org/library-management-system-in-python/" },
                { label: "OOP Project Ideas", url: "https://realpython.com/intermediate-python-project-ideas/" }
              ]
            }
          }
        ]
      },
      {
        week: 5,
        milestone: "Advanced OOP & Error Handling",
        days: [
          {
            day: 1,
            task: "Abstract classes and interfaces",
            details: {
              description: "Learn about ABC module, abstract methods, and implementing interfaces in Python.",
              resources: [
                { label: "Python ABC Module", url: "https://docs.python.org/3/library/abc.html" },
                { label: "Abstract Classes Tutorial", url: "https://realpython.com/python-interface/" }
              ]
            }
          },
          {
            day: 2,
            task: "Multiple inheritance and MRO",
            details: {
              description: "Understand multiple inheritance, method resolution order, and diamond problem solutions.",
              resources: [
                { label: "Multiple Inheritance", url: "https://docs.python.org/3/tutorial/classes.html#multiple-inheritance" },
                { label: "MRO in Python", url: "https://www.geeksforgeeks.org/method-resolution-order-in-python-inheritance/" }
              ]
            }
          },
          {
            day: 3,
            task: "Properties and descriptors",
            details: {
              description: "Master property decorators, getter/setter methods, and descriptor protocol.",
              resources: [
                { label: "Python Properties", url: "https://realpython.com/python-property/" },
                { label: "Descriptors Guide", url: "https://docs.python.org/3/howto/descriptor.html" }
              ]
            }
          },
          {
            day: 4,
            task: "Magic methods and operator overloading",
            details: {
              description: "Learn about dunder methods for arithmetic, comparison, and string representation.",
              resources: [
                { label: "Magic Methods Guide", url: "https://rszalski.github.io/magicmethods/" },
                { label: "Operator Overloading", url: "https://realpython.com/operator-function-overloading/" }
              ]
            }
          },
          {
            day: 5,
            task: "Custom exceptions and error handling",
            details: {
              description: "Create custom exception classes and implement comprehensive error handling strategies.",
              resources: [
                { label: "Custom Exceptions", url: "https://realpython.com/python-exceptions-handling/#user-defined-exceptions" },
                { label: "Exception Handling Best Practices", url: "https://docs.python.org/3/tutorial/errors.html" }
              ]
            }
          },
          {
            day: 6,
            task: "Context managers and with statements",
            details: {
              description: "Understand context managers, __enter__/__exit__ methods, and contextlib module.",
              resources: [
                { label: "Context Managers", url: "https://realpython.com/python-with-statement/" },
                { label: "Contextlib Module", url: "https://docs.python.org/3/library/contextlib.html" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 5 Practice Project",
            details: {
              description: "Build a banking system with custom exceptions, context managers, and advanced OOP features.",
              resources: [
                { label: "Banking System Project", url: "https://www.geeksforgeeks.org/python-program-for-bank-management-system/" },
                { label: "Advanced OOP Examples", url: "https://realpython.com/python3-object-oriented-programming/" }
              ]
            }
          }
        ]
      },
      {
        week: 6,
        milestone: "Data Structures & Algorithms",
        days: [
          {
            day: 1,
            task: "Tuples, sets, and advanced collections",
            details: {
              description: "Master tuples, sets, frozensets, and collections module (Counter, defaultdict, namedtuple).",
              resources: [
                { label: "Python Collections", url: "https://docs.python.org/3/library/collections.html" },
                { label: "Data Structures Tutorial", url: "https://realpython.com/python-data-structures/" }
              ]
            }
          },
          {
            day: 2,
            task: "Stacks and queues implementation",
            details: {
              description: "Implement stack and queue data structures using lists and collections.deque.",
              resources: [
                { label: "Stack Implementation", url: "https://www.geeksforgeeks.org/stack-in-python/" },
                { label: "Queue in Python", url: "https://docs.python.org/3/library/queue.html" }
              ]
            }
          },
          {
            day: 3,
            task: "Linked lists and trees basics",
            details: {
              description: "Understand and implement singly linked lists, doubly linked lists, and binary trees.",
              resources: [
                { label: "Linked Lists in Python", url: "https://realpython.com/linked-lists-python/" },
                { label: "Binary Trees", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/" }
              ]
            }
          },
          {
            day: 4,
            task: "Sorting algorithms implementation",
            details: {
              description: "Implement bubble sort, selection sort, insertion sort, merge sort, and quick sort.",
              resources: [
                { label: "Sorting Algorithms", url: "https://realpython.com/sorting-algorithms-python/" },
                { label: "Python Sorting Tutorial", url: "https://docs.python.org/3/howto/sorting.html" }
              ]
            }
          },
          {
            day: 5,
            task: "Searching algorithms and complexity",
            details: {
              description: "Learn linear search, binary search, and understand time/space complexity (Big O notation).",
              resources: [
                { label: "Search Algorithms", url: "https://www.geeksforgeeks.org/searching-algorithms/" },
                { label: "Big O Notation", url: "https://realpython.com/big-o-notation-time-complexity-python/" }
              ]
            }
          },
          {
            day: 6,
            task: "Hash tables and dictionaries deep dive",
            details: {
              description: "Understand hash functions, collision resolution, and dictionary implementation details.",
              resources: [
                { label: "Hash Tables Explained", url: "https://realpython.com/python-hash-table/" },
                { label: "Dictionary Internals", url: "https://www.geeksforgeeks.org/internal-working-of-dictionary-in-python/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 6 Practice Project",
            details: {
              description: "Build a contact management system using various data structures and search algorithms.",
              resources: [
                { label: "Data Structures Project", url: "https://www.geeksforgeeks.org/python-data-structures-and-algorithms/" },
                { label: "Algorithm Practice", url: "https://realpython.com/python-practice-problems/" }
              ]
            }
          }
        ]
      },
      {
        week: 7,
        milestone: "File Operations & Regular Expressions",
        days: [
          {
            day: 1,
            task: "Advanced file operations and paths",
            details: {
              description: "Master pathlib, os.path, file modes, and handling different file encodings.",
              resources: [
                { label: "Pathlib Tutorial", url: "https://realpython.com/python-pathlib/" },
                { label: "File Handling Guide", url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" }
              ]
            }
          },
          {
            day: 2,
            task: "CSV and JSON data processing",
            details: {
              description: "Learn to read, write, and manipulate CSV files and JSON data efficiently.",
              resources: [
                { label: "CSV Module", url: "https://realpython.com/python-csv/" },
                { label: "Working with JSON", url: "https://realpython.com/python-json/" }
              ]
            }
          },
          {
            day: 3,
            task: "Regular expressions fundamentals",
            details: {
              description: "Understand regex patterns, metacharacters, and the re module for pattern matching.",
              resources: [
                { label: "Python Regex Tutorial", url: "https://realpython.com/regex-python/" },
                { label: "Re Module Documentation", url: "https://docs.python.org/3/library/re.html" }
              ]
            }
          },
          {
            day: 4,
            task: "Advanced regex patterns and groups",
            details: {
              description: "Master capture groups, lookaheads, lookbehinds, and complex pattern matching.",
              resources: [
                { label: "Advanced Regex", url: "https://www.geeksforgeeks.org/python-regex/" },
                { label: "Regex Groups Tutorial", url: "https://realpython.com/regex-python-part-2/" }
              ]
            }
          },
          {
            day: 5,
            task: "XML and HTML parsing",
            details: {
              description: "Learn to parse XML with ElementTree and HTML with BeautifulSoup basics.",
              resources: [
                { label: "XML Processing", url: "https://docs.python.org/3/library/xml.etree.elementtree.html" },
                { label: "BeautifulSoup Basics", url: "https://realpython.com/beautiful-soup-web-scraper-python/" }
              ]
            }
          },
          {
            day: 6,
            task: "Logging and configuration files",
            details: {
              description: "Implement proper logging practices and handle configuration files (INI, YAML).",
              resources: [
                { label: "Python Logging", url: "https://realpython.com/python-logging/" },
                { label: "Config Files", url: "https://docs.python.org/3/library/configparser.html" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 7 Practice Project",
            details: {
              description: "Create a log analyzer that processes log files using regex and generates reports.",
              resources: [
                { label: "Log Analysis Project", url: "https://www.geeksforgeeks.org/python-program-for-log-parsing/" },
                { label: "Text Processing Projects", url: "https://realpython.com/python-practice-problems/" }
              ]
            }
          }
        ]
      },
      {
        week: 8,
        milestone: "Working with APIs & Web Scraping",
        days: [
          {
            day: 1,
            task: "HTTP requests and responses",
            details: {
              description: "Learn the requests library, HTTP methods, headers, and handling different response formats.",
              resources: [
                { label: "Requests Library", url: "https://realpython.com/python-requests/" },
                { label: "HTTP for Beginners", url: "https://docs.python-requests.org/en/latest/user/quickstart/" }
              ]
            }
          },
          {
            day: 2,
            task: "REST API consumption and authentication",
            details: {
              description: "Consume REST APIs, handle authentication (API keys, OAuth), and process API responses.",
              resources: [
                { label: "API Authentication", url: "https://realpython.com/api-integration-in-python/" },
                { label: "REST APIs Tutorial", url: "https://www.geeksforgeeks.org/python-api-tutorial/" }
              ]
            }
          },
          {
            day: 3,
            task: "Web scraping with BeautifulSoup",
            details: {
              description: "Master web scraping techniques, parsing HTML, and extracting data from websites.",
              resources: [
                { label: "Web Scraping Tutorial", url: "https://realpython.com/beautiful-soup-web-scraper-python/" },
                { label: "BeautifulSoup Documentation", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" }
              ]
            }
          },
          {
            day: 4,
            task: "Advanced scraping with Selenium",
            details: {
              description: "Learn Selenium for dynamic content scraping, handling JavaScript, and browser automation.",
              resources: [
                { label: "Selenium Tutorial", url: "https://realpython.com/modern-web-automation-with-python-and-selenium/" },
                { label: "Selenium WebDriver", url: "https://selenium-python.readthedocs.io/" }
              ]
            }
          },
          {
            day: 5,
            task: "Data validation and cleaning",
            details: {
              description: "Implement data validation, cleaning scraped data, and handling edge cases.",
              resources: [
                { label: "Data Validation", url: "https://realpython.com/python-data-validation/" },
                { label: "Data Cleaning Techniques", url: "https://www.geeksforgeeks.org/python-data-cleaning/" }
              ]
            }
          },
          {
            day: 6,
            task: "Rate limiting and ethical scraping",
            details: {
              description: "Learn about robots.txt, rate limiting, proxies, and ethical web scraping practices.",
              resources: [
                { label: "Ethical Web Scraping", url: "https://realpython.com/web-scraping-with-scrapy-and-mongodb/" },
                { label: "Rate Limiting", url: "https://www.geeksforgeeks.org/rate-limiting-in-python/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 8 Practice Project",
            details: {
              description: "Build a news aggregator that scrapes multiple news websites and creates a daily digest.",
              resources: [
                { label: "News Scraper Project", url: "https://www.geeksforgeeks.org/python-program-to-scrape-news-articles/" },
                { label: "Web Scraping Projects", url: "https://realpython.com/web-scraping-with-scrapy-and-mongodb/" }
              ]
            }
          }
        ]
      },
      {
        week: 9,
        milestone: "Database Operations & SQL",
        days: [
          {
            day: 1,
            task: "Database fundamentals and SQLite",
            details: {
              description: "Learn database concepts, SQLite basics, and connecting to databases with Python.",
              resources: [
                { label: "SQLite Tutorial", url: "https://realpython.com/python-sql-libraries/" },
                { label: "Database Fundamentals", url: "https://docs.python.org/3/library/sqlite3.html" }
              ]
            }
          },
          {
            day: 2,
            task: "SQL queries and database operations",
            details: {
              description: "Master SELECT, INSERT, UPDATE, DELETE operations and SQL joins.",
              resources: [
                { label: "SQL Tutorial", url: "https://www.w3schools.com/sql/" },
                { label: "Python SQLite3", url: "https://realpython.com/python-sql-libraries/#sqlite" }
              ]
            }
          },
          {
            day: 3,
            task: "ORM with SQLAlchemy basics",
            details: {
              description: "Introduction to Object-Relational Mapping, SQLAlchemy core, and basic ORM operations.",
              resources: [
                { label: "SQLAlchemy Tutorial", url: "https://realpython.com/python-sqlite-sqlalchemy/" },
                { label: "SQLAlchemy Documentation", url: "https://docs.sqlalchemy.org/en/14/tutorial/" }
              ]
            }
          },
          {
            day: 4,
            task: "Advanced SQLAlchemy and relationships",
            details: {
              description: "Learn about table relationships, foreign keys, and advanced SQLAlchemy features.",
              resources: [
                { label: "SQLAlchemy Relationships", url: "https://docs.sqlalchemy.org/en/14/orm/basic_relationships.html" },
                { label: "Advanced SQLAlchemy", url: "https://realpython.com/python-sqlite-sqlalchemy/" }
              ]
            }
          },
          {
            day: 5,
            task: "Database migrations and schemas",
            details: {
              description: "Understand database migrations, schema design, and version control for databases.",
              resources: [
                { label: "Database Migrations", url: "https://alembic.sqlalchemy.org/en/latest/tutorial.html" },
                { label: "Schema Design", url: "https://www.geeksforgeeks.org/database-schema-in-dbms/" }
              ]
            }
          },
          {
            day: 6,
            task: "Working with PostgreSQL/MySQL",
            details: {
              description: "Connect to external databases, handle connection pooling, and database best practices.",
              resources: [
                { label: "PostgreSQL with Python", url: "https://realpython.com/python-sql-libraries/#postgresql" },
                { label: "MySQL Connector", url: "https://dev.mysql.com/doc/connector-python/en/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 9 Practice Project",
            details: {
              description: "Create a inventory management system with full CRUD operations and complex queries.",
              resources: [
                { label: "Inventory System Project", url: "https://www.geeksforgeeks.org/python-mysql-database-connectivity/" },
                { label: "Database Projects", url: "https://realpython.com/python-sql-libraries/" }
              ]
            }
          }
        ]
      },
      {
        week: 10,
        milestone: "Testing & Debugging",
        days: [
          {
            day: 1,
            task: "Unit testing with unittest",
            details: {
              description: "Learn unit testing principles, unittest module, test cases, and assertions.",
              resources: [
                { label: "Unit Testing Tutorial", url: "https://realpython.com/python-testing/" },
                { label: "Unittest Documentation", url: "https://docs.python.org/3/library/unittest.html" }
              ]
            }
          },
          {
            day: 2,
            task: "Advanced testing with pytest",
            details: {
              description: "Master pytest framework, fixtures, parametrized tests, and test organization.",
              resources: [
                { label: "Pytest Tutorial", url: "https://realpython.com/pytest-python-testing/" },
                { label: "Pytest Documentation", url: "https://docs.pytest.org/en/stable/" }
              ]
            }
          },
          {
            day: 3,
            task: "Mocking and test doubles",
            details: {
              description: "Learn about mocks, stubs, and test doubles using unittest.mock and pytest-mock.",
              resources: [
                { label: "Python Mocking", url: "https://realpython.com/python-mock-library/" },
                { label: "Mock Documentation", url: "https://docs.python.org/3/library/unittest.mock.html" }
              ]
            }
          },
          {
            day: 4,
            task: "Test coverage and CI/CD basics",
            details: {
              description: "Measure test coverage, set up continuous integration, and automated testing.",
              resources: [
                { label: "Test Coverage", url: "https://realpython.com/python-code-coverage/" },
                { label: "CI/CD for Python", url: "https://realpython.com/python-continuous-integration/" }
              ]
            }
          },
          {
            day: 5,
            task: "Debugging techniques and tools",
            details: {
              description: "Master debugging with pdb, IDE debuggers, and logging for debugging purposes.",
              resources: [
                { label: "Python Debugging", url: "https://realpython.com/python-debugging-pdb/" },
                { label: "Debugging Best Practices", url: "https://docs.python.org/3/library/pdb.html" }
              ]
            }
          },
          {
            day: 6,
            task: "Performance profiling and optimization",
            details: {
              description: "Learn profiling tools, identify bottlenecks, and optimize Python code performance.",
              resources: [
                { label: "Python Profiling", url: "https://realpython.com/python-profiling/" },
                { label: "Performance Optimization", url: "https://docs.python.org/3/library/profile.html" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 10 Practice Project",
            details: {
              description: "Refactor previous projects with comprehensive tests, debugging, and performance optimization.",
              resources: [
                { label: "Testing Best Practices", url: "https://realpython.com/python-testing/" },
                { label: "Code Quality Tools", url: "https://realpython.com/python-code-quality/" }
              ]
            }
          }
        ]
      },
      {
        week: 11,
        milestone: "GUI Development with Tkinter",
        days: [
          {
            day: 1,
            task: "Tkinter basics and widgets",
            details: {
              description: "Learn Tkinter fundamentals, basic widgets (Label, Button, Entry), and window management.",
              resources: [
                { label: "Tkinter Tutorial", url: "https://realpython.com/python-gui-tkinter/" },
                { label: "Tkinter Documentation", url: "https://docs.python.org/3/library/tkinter.html" }
              ]
            }
          },
          {
            day: 2,
            task: "Layout management and geometry",
            details: {
              description: "Master pack, grid, and place geometry managers for organizing GUI components.",
              resources: [
                { label: "Tkinter Layout", url: "https://realpython.com/python-gui-tkinter/#organizing-layout-with-frames" },
                { label: "Geometry Managers", url: "https://www.geeksforgeeks.org/python-tkinter-geometry-managers/" }
              ]
            }
          },
          {
            day: 3,
            task: "Event handling and user interaction",
            details: {
              description: "Implement event handlers, bind functions to events, and handle user input.",
              resources: [
                { label: "Tkinter Events", url: "https://realpython.com/python-gui-tkinter/#handling-events" },
                { label: "Event Binding", url: "https://www.geeksforgeeks.org/python-tkinter-events/" }
              ]
            }
          },
          {
            day: 4,
            task: "Advanced widgets and dialogs",
            details: {
              description: "Learn Canvas, Text, Treeview widgets, and dialog boxes (messagebox, filedialog).",
              resources: [
                { label: "Advanced Tkinter", url: "https://realpython.com/python-gui-tkinter/#working-with-images" },
                { label: "Tkinter Dialogs", url: "https://www.geeksforgeeks.org/python-tkinter-messagebox/" }
              ]
            }
          },
          {
            day: 5,
            task: "Menus, toolbars, and styling",
            details: {
              description: "Create menus, toolbars, and customize the appearance of GUI applications.",
              resources: [
                { label: "Tkinter Menus", url: "https://realpython.com/python-gui-tkinter/#adding-a-menu-bar" },
                { label: "GUI Styling", url: "https://www.geeksforgeeks.org/python-tkinter-menu/" }
              ]
            }
          },
          {
            day: 6,
            task: "Model-View-Controller (MVC) pattern",
            details: {
              description: "Implement MVC architecture in GUI applications for better code organization.",
              resources: [
                { label: "MVC in Python", url: "https://realpython.com/the-model-view-controller-mvc-paradigm-summarized-with-legos/" },
                { label: "GUI Architecture", url: "https://www.geeksforgeeks.org/mvc-framework-in-python/" }
              ]
            }
          },
          {
            day: 7,
            task: "Week 11 Practice Project",
            details: {
              description: "Build a complete desktop application like a text editor or personal finance tracker.",
              resources: [
                { label: "Text Editor Project", url: "https://www.geeksforgeeks.org/python-tkinter-text-editor/" },
                { label: "GUI Project Ideas", url: "https://realpython.com/python-gui-tkinter/" }
              ]
            }
          }
        ]
      },
      {
        week: 12,
        milestone: "Final Project & Deployment",
        days: [
          {
            day: 1,
            task: "Project planning and architecture",
            details: {
              description: "Plan a comprehensive final project, design architecture, and set up project structure.",
              resources: [
                { label: "Project Planning", url: "https://realpython.com/python-project-structure/" },
                { label: "Software Architecture", url: "https://www.geeksforgeeks.org/software-engineering-project-planning/" }
              ]
            }
          },
          {
            day: 2,
            task: "Virtual environments and dependencies",
            details: {
              description: "Master virtual environments, pip, requirements.txt, and dependency management.",
              resources: [
                { label: "Virtual Environments", url: "https://realpython.com/python-virtual-environments-a-primer/" },
                { label: "Dependency Management", url: "https://docs.python.org/3/tutorial/venv.html" }
              ]
            }
          },
          {
            day: 3,
            task: "Code documentation and docstrings",
            details: {
              description: "Write comprehensive documentation, docstrings, and generate documentation with Sphinx.",
              resources: [
                { label: "Python Docstrings", url: "https://realpython.com/documenting-python-code/" },
                { label: "Sphinx Documentation", url: "https://www.sphinx-doc.org/en/master/tutorial/" }
              ]
            }
          },
          {
            day: 4,
            task: "Package creation and distribution",
            details: {
              description: "Learn to create Python packages, setup.py, and distribute packages on PyPI.",
              resources: [
                { label: "Python Packaging", url: "https://realpython.com/python-modules-packages/" },
                { label: "PyPI Tutorial", url: "https://packaging.python.org/tutorials/packaging-projects/" }
              ]
            }
          },
          {
            day: 5,
            task: "Deployment strategies and hosting",
            details: {
              description: "Explore deployment options: Heroku, AWS, Docker basics, and cloud deployment.",
              resources: [
                { label: "Python Deployment", url: "https://realpython.com/python-web-applications/" },
                { label: "Docker for Python", url: "https://realpython.com/python-microservices-grpc/" }
              ]
            }
          },
          {
            day: 6,
            task: "Version control with Git",
            details: {
              description: "Master Git workflows, branching strategies, and collaborative development.",
              resources: [
                { label: "Git Tutorial", url: "https://realpython.com/python-git-github-intro/" },
                { label: "Git Best Practices", url: "https://www.atlassian.com/git/tutorials" }
              ]
            }
          },
          {
            day: 7,
            task: "Final Project Presentation",
            details: {
              description: "Complete and present your final project. Create a portfolio-ready application showcase.",
              resources: [
                { label: "Portfolio Projects", url: "https://realpython.com/intermediate-python-project-ideas/" },
                { label: "Project Showcase", url: "https://github.com/topics/python-projects" }
              ]
            }
          }
        ]
      }
    ]
  )

  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const toggleTask = (weekIndex: number, dayIndex: number) => {
    const taskId = `${weekIndex}-${dayIndex}`
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const handleConfirmPlan = () => {
    console.log("Confirmed")
    // Future: Add navigation or API call here
  }

  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Target className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Your Learning Plan
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Complete Python mastery in 12 weeks with this comprehensive learning plan
        </p>
      </motion.div>

      {/* Plan Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        <Accordion type="multiple" className="space-y-4">
          {plan.map((week, weekIndex) => (
            <AccordionItem
              key={week.week}
              value={`week-${week.week}`}
              className="border border-gray-800 rounded-xl bg-gray-900/30 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Week {week.week}
                      </h3>
                      <p className="text-gray-400 text-sm">{week.milestone}</p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  {week.days.map((day, dayIndex) => (
                    <TaskItem
                      key={`${weekIndex}-${dayIndex}`}
                      task={day}
                      weekNumber={week.week}
                      isExpanded={expandedTasks.has(`${weekIndex}-${dayIndex}`)}
                      onToggle={() => toggleTask(weekIndex, dayIndex)}
                    />
                  ))}
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Confirm Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center pt-8"
        >
          <Button
            onClick={handleConfirmPlan}
            variant="glow"
            size="xl"
            className="w-full max-w-md mx-auto font-semibold"
          >
            Confirm & Start Plan
          </Button>
          <p className="text-gray-500 text-sm mt-3">
            Ready to begin your Python learning journey?
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
} 