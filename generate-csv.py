import csv
import random

years = list(range(1980, 2025))

titles = [
    "Can't Stop the Music", "Cruising", "Some Movie", "Another Film", "Movie Title",
    "The Great Adventure", "Final Countdown", "Lost in Time", "Hidden Secrets",
    "Rising Sun", "Dark Horizon", "Midnight Chase", "Broken Dreams", "Eternal Light",
    "Silent Whisper", "The Last Stand", "Echoes of the Past", "Shattered World", "New Dawn"
]

studios = [
    "Associated Film Distribution", "Lorimar Productions, United Artists", "Studio A",
    "Studio B", "Paramount Pictures", "Warner Bros.", "Universal Pictures",
    "20th Century Fox", "Columbia Pictures", "MGM", "DreamWorks", "Lionsgate"
]

producers = [
    "Allan Carr", "Jerry Weintraub", "Producer X", "Producer Y",
    "Steven Spielberg", "Kathleen Kennedy", "George Lucas", "Martin Scorsese",
    "Christopher Nolan", "Quentin Tarantino", "James Cameron", "Ridley Scott"
]

with open("movies.csv", "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile, delimiter=';')
    writer.writerow(["year", "title", "studios", "producers", "winner"])
    
    for i in range(1_000_000):
        year = random.choice(years)
        title = random.choice(titles) + f" {i}"
        studio = random.choice(studios)
        selected = random.sample(producers, 3)
        producer = f"{selected[0]}, {selected[1]} and {selected[2]}"
        winner = random.choice(["yes", ""])
        writer.writerow([year, title, studio, producer, winner])

print("CSV de 1 milhão de registros gerado com mais variedade!")
