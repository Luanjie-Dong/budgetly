
from extract_data import extract_csv
import os
import pandas as pd 
import json



             


def import_all_csv(folder,year):

    data = []
    unique_keys = []
    for file in os.listdir(folder):
        if file.endswith('.csv'):
            file_path = os.path.join(folder,file)

            file_data = extract_csv(file_path,year)

            for transactions in file_data:
                if transactions[0] not in unique_keys:
                    data.append(transactions)
                    unique_keys.append(transactions[0])
    items = []     
    for row in data:
        item = {
            "key": row[0],
            "date": row[1],
            "spend": row[2],
            "recieve":row[3],
            "Information": row[4],
            "Category": "",
            "Type": " "
        }

        items.append(item)
    return items 

   
def update_data(new_df,data_path):
    if os.path.exists(data_path):
        current_data = pd.read_json(data_path)
        current_df = pd.DataFrame(current_data)

        if "key" not in current_df.columns:
            current_df["key"] = ""

        if new_df.shape[0] != current_df.shape[0]:
            print(f'Transactions updated from {min(new_df.shape[0],current_df.shape[0])} to {max(new_df.shape[0],current_df.shape[0])}')
        else:
            print("No change has been made")

        merged_df = pd.concat([current_df, new_df], ignore_index=True)
        merged_df = merged_df.drop_duplicates(subset="key", keep="first")
        merged_df['date'] = pd.to_datetime(merged_df['date'])
        merged_df = merged_df.sort_values(by="date",ascending=False)
        merged_df.to_json(data_path, orient="records", indent=4, date_format="iso")

        print(f"Data has been updated and saved to {data_path}")
    else:
        new_df['date'] = pd.to_datetime(new_df['date'])
        new_df = new_df.sort_values(by="date",ascending=False)
        new_df.to_json(data_path, orient="records", indent=4, date_format="iso")


       
def match_data(year):
    data_path = f"data/{year}/{year}_transactions.json"
    data_path2 = f"data/{str(int(year) - 1)}/{str(int(year) - 1)}_transactions.json"

    os.makedirs(os.path.dirname(data_path), exist_ok=True)
    os.makedirs(os.path.dirname(data_path2), exist_ok=True)

    for path in [data_path, data_path2]:
        if not os.path.exists(path):
            with open(path, "w") as file:
                json.dump([], file)

    new_data = import_all_csv(f"data/{year}", year)

    filter_data = [transaction for transaction in new_data if transaction.get("date", "").startswith(str(year))]
    crossed_data = [transaction for transaction in new_data if not transaction.get("date", "").startswith(str(year))]

    if filter_data:
        new_df1 = pd.DataFrame(filter_data)
        update1 = update_data(new_df1, data_path)

    if crossed_data:
        new_df2 = pd.DataFrame(crossed_data)
        update2 = update_data(new_df2, data_path2)


    return {
        "current_year_updates": len(filter_data) if filter_data else 0,
        "previous_year_updates": len(crossed_data) if crossed_data else 0,
    }
    







if __name__ == "__main__":
    months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
    year = "2024"
    folder_path = f"data/{year}"

    

    data = import_all_csv(folder_path,year)
    update = match_data(year)

   
   


