import datetime

# Get the current date
current_date = datetime.datetime.now()

# Get the day of the week as an integer (Monday is 0 and Sunday is 6)
day_of_week = current_date.weekday()

print(day_of_week)