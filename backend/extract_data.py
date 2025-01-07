import gspread
import time
from datetime import datetime



def extract_csv(filename,year):
    items =[]
    with open(filename,'r') as input_file:
        for lines in input_file:
            lines = lines.rstrip("\n")
            columns = lines.split(",")
            if year in columns[0]:
                if columns[4] == "":
                    del columns[4]

                if len(columns) > 7:
                    del columns[-1]

                date = ""
                details = " ".join(map(str, columns[4:]))
                unique_key = " ".join(map(str, columns)).replace(" ", "")
                
                months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
                
                date = ""
                for month in months:
                    if month.upper() in columns[4]:
                        date_detail = columns[4].split(" ")
                        date = date_detail[-1].strip()

                

                if date == "" or date == ' ':
                    date = " ".join(map(str, columns[0])).lower().replace(" ", "")
                    date_obj = datetime.strptime(date, "%d%b%Y")
                else:       
                    if "DEC" in date and "Jan" in columns[0]:
                        old_year = str(int(year) - 1)  
                        date_obj = datetime.strptime(date+old_year, "%d%b%Y")
                    else:
                        date_obj = datetime.strptime(date+year, "%d%b%Y")
                    

                date_str = date_obj.isoformat()
                if '.' in columns[2]:
                    items.append([unique_key,date_str,float(columns[2]),0,details])
                elif "." in columns[3]:
                    items.append([unique_key,date_str,0,float(columns[3]),details])

            

    return items



if __name__ == "__main__":
   


    data = extract_csv("../2024/dec.csv","2024")

    for row in data:
        print(row)
        