from django.urls import path
from .views import leaderboard_list, winner_list, player_detail, player_list

urlpatterns = [
     path("api/leaderboard/", leaderboard_list, name="leaderboard-list"),
    path("api/player/", player_list, name="player-list"),  # /api/leaderboard/
    path("api/player/<int:player_id>/", player_detail, name="player-detail"),
    path("winner/", winner_list, name="winner-list"),
]