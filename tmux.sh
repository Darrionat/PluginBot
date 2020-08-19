#dir which contains the bot directory
basedir=$PWD

#tmux session name (`basename \"$basedir\"` -> basedir's name)
session="`basename \"$basedir\"`"

if [[ basedir != */ ]]
then
   basedir+="/"
fi

start() {
    tmux new-session -d -s $session
    
    echo "Starting bot"

    git fetch --all
    git reset --hard origin/master

    tmux send-keys -t $session:0 "forever start index.js" C-m
    
    echo "Server started. Attaching session..."
    
    sleep 0.5
    
    tmux attach-session -t $session:0
}

stop() {
    echo "Stopping bot..."
    cd ~/pluginbot
    forever stop index.js
    echo "Killing tmux session"
    tmux kill-session -t $session
    echo "Bot stopped"
}

case "$1" in
start)
    start
;;
stop)
    stop
;;
attach)
    tmux attach -t $session
;;
restart)
    stop
    echo "Restarting server..."
    sleep 0.8
    start
;;
*)
echo "Usage: tmux.sh (start|stop|restart|attach)" >&2
;;
esac
