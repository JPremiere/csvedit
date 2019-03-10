/**
 * Copyright (c) 2019 Ladygin Vladimir
 */

Array.prototype.peek = function() {
	return this.slice(-1)[0];
};

function isDigit(char) {
	return /\d/.test(char);
}

function isLetter(char) {
	return /[A-Z]/.test(char);
}

function isOperator(char) {
	switch (char) {
	case '+':
	case '-':
	case '*':
	case '/':
		return true;
	default:
		return false;
	}
}

function isLeftParenthesis(char) {
	return char === '(';
}

function isRightParenthesis(char) {
	return char === ')';
}

function parse(text) {

	var tokens = [];
	var stack = [];

	var priority = {
			'+' : 2,
			'-' : 2,
			'*' : 3,
			'/' : 3
	};

	text = text.replace(/\s+/g, '');
	var temp;
	for (var i = 0; i < text.length; i++) {
		temp = text.charAt(i);

		if (isDigit(temp)) {
			var column = text.charAt(i + 1);
			while (column.match(/\d|\./)) {
				temp += column;
				i++;
				column = text.charAt(i + 1);
			}

			if (!temp.match(/^\d+(\.\d+)?$/)){
				throw 'Token is not number';
			}
			tokens.push(temp);
			continue;
		}

		if (isLetter(temp)) {
			var column = text.charAt(i + 1);
			while (isDigit(column)) {
				temp += column;
				i++;
				column = text.charAt(i + 1);
			}
			tokens.push(temp);
			continue;
		}

		if (isOperator(temp)) {
			var prime = priority[temp];
			while (stack.peek() && (isOperator(stack.peek())) && (prime <= priority[stack.peek()])) {
				tokens.push(stack.pop());
			}
			stack.push(temp);
			continue;
		}

		if (isLeftParenthesis(temp)) {
			stack.push(temp);
			continue;
		}

		if (isRightParenthesis(temp)) {
			while (stack.peek() && !isLeftParenthesis(stack.peek())) {
				tokens.push(stack.pop());
			}
			stack.pop();
			continue;
		}

		throw `Symbol is never used ${temp}`;
	}

	return tokens.concat(stack.reverse());
}

function myeval(text, data, ...byTokens) {

	var tokens = parse(text);
	console.log('Reverse Polish Notation: ' + tokens.join(' '));

	var stack = [];

	var operator = {
			'+' : function(a, b) {
				return a + b;
			},
			'-' : function(a, b) {
				return a - b;
			},
			'*' : function(a, b) {
				return a * b;
			},
			'/' : function(a, b) {
				return a / b;
			}
	};

	tokens.forEach(function(token) {
		if (isOperator(token)) {
			var b = stack.pop();
			var a = stack.pop();
			stack.push(operator[token](a, b));
		} else if (token.match(/^\d+(\.\d+)?$/)) {
			stack.push(parseFloat(token));
		} else if (byTokens.includes(token)){
			throw `Recursive call by ${token}`;
		} else {
			stack.push(data[token]);
		}
	});

	var result =  stack.pop();
	if (!isFinite(result)) {
		return text;
	}

	return result;
}