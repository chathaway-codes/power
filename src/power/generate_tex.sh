mkdir ../tex
for x in `ls`; do

if [ -d "$x" ]; then
  mkdir -p ../tex/$x
  for y in `ls $x/*.py`; do
    pygmentize -f latex -O full,linenos=1 $y > ../tex/$y.tex
  done
else
  pygmentize -f latex -O full,linenos=1 $x > ../tex/$x.tex
fi

done