from django.db import models

class Leaderboard(models.Model):
    name = models.CharField(max_length=100)
    time = models.FloatField()  # Time taken for 10 questions (lower is better) # Default to an empty list

    def __str__(self):
        return f"{self.name} - {self.time}s"

class Player(models.Model):
    name = models.CharField(max_length=100)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} -  {'Complete' if self.is_complete else 'Incomplete'}"

class Winner(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
