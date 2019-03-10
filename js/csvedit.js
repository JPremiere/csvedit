/**
 * Copyright (c) 2019 Ladygin Vladimir
 */

var csvEdit = (function() {
	var data = {};

	return {
		settings : {
			table : null,
			rows : 0,
			columns : 0
		},

		init : function(settings) {
			if (typeof settings === 'undefined') {
				this.settings = {
					table : $('table#myeditor'),
					rows : 5,
					columns : 5
				}
			} else {
				this.settings = settings;
			}

			this.bindUIActions();

			this.resize(this.settings.rows, this.settings.columns);
		},

		bindUIActions : function() {
			var self = this;
			this.settings.table.on("click", "td", function() {
				var element = $(this);
				if (element.children('input').length) {
					return;
				}
				var cell = element
					.clone()
					.children()
					.remove()
					.end()
					.text();
				var input = $('<input/>');
				input.attr('type', 'text').attr('class', 'form-control').val(cell);
				input.blur(function() {
					self.calc();
				});
				element.html(input);
				input.select();
			});
		},

		resize : function(rows, columns) {
			var self = this;
			var table = self.settings.table;

			var tableRows = table.find('tr').length;
			var tableColumns = table.find('tr:first td').length;

			var anyRows = rows - tableRows;
			if (anyRows > 0) {
				for (var i = tableRows; i < rows; i++) {
					tempTr = $('<tr/>');
					for (var j = 0; j < tableColumns; j++) {
						tempTr.append(self.createCell(i, j))
					}
					tempTr.appendTo(table);
				}
			} else if (anyRows < 0) {
				table.find('tr').each(function(index) {
					if (index >= rows) {
						$(this).remove();
					}
				});
			}

			var anyColumns = columns - tableColumns;
			if (anyColumns > 0) {
				table.find('tr').each(function(index) {
					for (var j = tableColumns; j < columns; j++) {
						self
							.createCell(index, j)
							.appendTo($(this));
					}
				});
			} else if (anyColumns < 0) {
				table.find('tr').each(function() {
					$(this).children('td').each(function(index) {
						if (index >= columns) {
							$(this).remove();
						}
					});
				});
			}
		},

		calc : function() {
			this.settings.table.find('tr').each(function() {
				$(this).find('td').each(function() {
					var self = $(this);
					try {
						data[self.attr('id')] = [];
						self.html(data[self.attr('id')]);

						if (self.hasClass('table-danger')) {
							self.removeClass('table-danger');
						}
					} catch (e) {
						self.addClass('table-danger');
						var p = self.children('p');
						if (p.length) {
							p.text(e);
						} else {
							$('<p/>').attr('class', 'alert alert-danger')
								.text(e)
								.appendTo(self);
						}
						console.log(e);
					}
				});
			});
		},

		createCell : function(row, column) {
			var id = String.fromCharCode("A".charCodeAt(0) + column) + (row + 1);
			var result = $('<td/>').attr('id', id);

			var recursiveIds = [];
			
			var getter = function() {
				recursiveIds.push(id);
				
				var element = $('#' + id);
				if (!element.length) {
					return '';
				}

				var input = element.children('input');
				var val = input.length
					? input.val()
					: element
						.clone()
						.children()
						.remove()
						.end()
						.text();
				if (!val.length) {
					return '';
				}

				if (val.match(/^\d+$/)) {
					return isNaN(parseFloat(val)) ? val : parseFloat(val);
				} else {
					return myeval(val, data, ...recursiveIds);
				}
			};

			var setter = function(...ids) {
				recursiveIds = ids;
			};

			Object.defineProperty(data, id, {
				get : getter,
				set : setter
			});

			return result;
		},

		readCsv : function(text) {
			if (text.length == 0) {
				return;
			}

			var self = this;
			var table = self.settings.table;

			table.empty();
			data = {};

			var lines = text.split(/\r\n|\n/);
			var tempCells;
			var trs = table.find('tr');
			var tempTr;
			var tempTd;
			var tempTds;
			lines.forEach(function(line, lineIndex) {
				if (!line) {
					return;
				}

				console.log(lineIndex);
				tempTr = trs.eq(lineIndex);
				if (!tempTr.length) {
					tempTr = $('<tr/>').appendTo(table);
				}

				tempTds = tempTr.children('td');
				tempCells = line.split(',');
				tempCells.forEach(function(cell, cellIndex) {
					tempTd = tempTds.eq(cellIndex);
					if (!tempTd.length) {
						tempTd = self
							.createCell(lineIndex, cellIndex, cell)
							.appendTo(tempTr);
					}

					tempTd.text(cell);
				});

				self.calc();
			});
		},

		writeCsv : function() {
			return this.settings.table.find('tr').get().map(function(row) {
				return $(row).find('td').get().map(function(cell) {
					var element = $(cell);
					var input = element.children('input');
					if (input.length) {
						return input.val();
					}

					return element.text();
				}).join(',');
			}).join('\r\n');
		}
	}
})();