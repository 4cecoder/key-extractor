import re

def extract_key_comp(id, js):
    functions_added = []

    def get_function(func_name, js, recur=True):
        nonlocal functions_added
        string = ""
        if func_name in functions_added:
            return ""
        functions_added.append(func_name)
        func_name_w_function = "function " + func_name
        js_temp = "(" + substring_after(js, func_name_w_function + "(")

        if js_temp == "(":
            return ""
        params = find_closing_braces(js_temp)
        js_temp = substring_after(js_temp, params)
        func_body = find_closing_braces(js_temp)

        if recur:
            other_func = find_first_brace(substring_after(func_body, "return "))
            string += get_function(other_func, js)
        string += (func_name_w_function + params + func_body)
        return string

    # Helper functions for string manipulation
    def substring_after(s, to_find):
        index = s.find(to_find)
        return "" if index == -1 else s[index + len(to_find):]

    def substring_before(s, to_find):
        index = s.find(to_find)
        return "" if index == -1 else s[:index]

    def find_closing_braces(s):
        output = ""
        stack = []
        brackets = ["(", "[", "{"]
        closing_brackets = [")", "]", "}"]
        braces = ["'", "\""]
        escaped_braces = ["\\'", "\\\""]
        last_char = ""
        for c in s:
            output += c

            if c in brackets and stack[-1] not in braces:
                stack.append(c)
            elif c in closing_brackets and stack[-1] not in braces:
                stack.pop()
            elif c in braces:
                if last_char == "\\" and f"\\{c}" in escaped_braces:
                    pass
                else:
                    if c == stack[-1]:
                        stack.pop()
                    else:
                        stack.append(c)

            last_char = c

            if len(stack) == 0:
                break
        return output

    def find_first_brace(s):
        output = ""
        for c in s:
            if c == "(":
                break
            output += c
        return output
