#!/usr/bin/env Rscript
library(getopt)
library(OpenRepGrid)

#these are some example arguments
# --name="Element 1|Element 2|Element 3" --l.name="Construct 1|Construct 2|Construct 3" --r.name "Not Construct 1|Not Construct 2|Not Construct 3" --scores "1^|2^|3^|4^|5^|6^|7^|1^|2" --l.pole="1" --r.pole="7"

spec = matrix(c(
	'name', NA, 2, "character", "Element names",
	'l.name', NA, 2, "character", "Left side constructs",
	'r.name', NA, 2, "character", "Right side constructs",
	'scores', NA, 2, "character", "Scores",
	'l.pole', NA, 2, "integer", "Left pole rating",
	'r.pole', NA, 2, "integer", "Right pole rating",
	'workdir', NA, 2, "character", "Working directory"
), byrow=TRUE, ncol=5)
opt = getopt(spec) #get arguments

if (is.na(opt$name) || is.na(opt$l.name) || is.na(opt$r.name) || is.na(opt$scores))
{
	stop("Requires arguments: --name, --l.name, --r.name, --scores") 
}
if (is.na(opt$r.pole) || is.na(opt$l.pole))
{
	print("The arguments --l.pole and --r.pole are recommended to visualize more data")
}
if (!is.null(opt$workdir)) 
{
	print(opt$workdir)
	setwd(opt$workdir)
}
#getwd()

# these separate arguments by the | (pipe) character
# strsplit produces an array of vectors, we only want the first element because there are no other elements
# so we tell it to to only look at the first one
# if we don't clarify the first element then ORG doesn't see a vector
opt$name <- strsplit(opt$name, '|', fixed=TRUE)[[1]]
opt$l.name <- strsplit(opt$l.name, '|', fixed=TRUE)[[1]]
opt$r.name <- strsplit(opt$r.name, '|', fixed=TRUE)[[1]]
opt$scores <- strsplit(opt$scores, '|', fixed=TRUE)[[1]]
opt$scores <- sapply(opt$scores, strtoi) # convert each score string to integers

# grid generation
grid = makeRepgrid(list(name=opt$name, l.name=opt$l.name,r.name=opt$r.name, scores=opt$scores))
grid <- setScale(grid, opt$l.pole, opt$r.pole)

# plots
dir.create("plot")
setwd("plot")
pdf("bertin.pdf")
try(bertin(grid), TRUE)
graphics.off()
pdf("bertinCluster.pdf")
try(bertinCluster(grid), TRUE)
graphics.off()
pdf("biplot2d.pdf")
try(biplot2d(grid), TRUE)
graphics.off()
pdf("biplotPseudo3d.pdf")
try(biplotPseudo3d(grid), TRUE)
graphics.off()
pdf("biplotSlater2d.pdf")
try(biplotSlater2d(grid), TRUE)
graphics.off()
pdf("biplotSlaterPseudo3d.pdf")
try(biplotSlaterPseudo3d(grid), TRUE)
graphics.off()
pdf("biplotEsa2d.pdf")
try(biplotEsa2d(grid), TRUE)
graphics.off()
pdf("biplotEsaPseudo3d.pdf")
try(biplotEsaPseudo3d(grid), TRUE)
graphics.off()
pdf("cluster.pdf") # misc
try(cluster(grid), TRUE)
graphics.off()

# element analyses
setwd("..")
dir.create("element")
setwd("element")
sink("statsElements.txt")
try(statsElements(grid), TRUE)
sink("elementCor.txt")
try(elementCor(grid), TRUE)
sink("distanceElements.txt")
try(distance(grid, along=2), TRUE)
sink("distanceSlater.txt")
try(distanceSlater(grid), TRUE)
sink("distanceHartmann.txt")
try(distanceHartmann(grid), TRUE)
sink("distanceNormalized.txt")
try(distanceNormalized(grid), TRUE)
pdf("clusterElements.pdf")
try(cluster(grid, along=2), TRUE)
graphics.off()

# construct analyses
setwd("..")
dir.create("construct")
setwd("construct")
sink("statsConstructs.txt")
try(statsConstructs(grid), TRUE)
sink("constructCor.txt")
try(constructCor(grid), TRUE)
sink("constructRmsCor.txt")
try(constructRmsCor(grid), TRUE)
sink("constructSomersDCol.txt")
try(constructD(grid), TRUE)
sink("constructSomersDRow.txt")
try(constructD(grid, dep="r"), TRUE)
sink("distanceConstructs.txt")
try(distance(grid), TRUE)
#add swapped poles??
sink("constructPca.txt")
try(constructPca(grid), TRUE)
pdf("clusterConstructs.pdf")
try(cluster(grid, along=1), TRUE)
graphics.off()

# index analyses
setwd("..")
dir.create("index")
setwd("index")
sink("indexIntensity.txt")
try(indexIntensity(grid), TRUE)
sink("indexPvaff.txt")
try(indexPvaff(grid), TRUE)
sink("indexConflictSladeSheehan.txt")
try(indexConflict1(grid), TRUE)
sink("indexConflictBasslerEtAl.txt")
try(indexConflict2(grid), TRUE)
sink("indexConflictBell.txt")
try(indexConflict3(grid), TRUE)
# requires index input
#sink("indexDilemma.txt")
#indexDilemma(grid)