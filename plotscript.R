#!/usr/bin/env Rscript
library(getopt)
library(ggplot2)
library(OpenRepGrid)

#these are some example arguments
# --name="Element 1|Element 2|Element 3" --l.name="Construct 1|Construct 2|Construct 3" --r.name "Not Construct 1|Not Construct 2|Not Construct 3" --scores "1^|2^|3^|4^|5^|6^|7^|1^|2" --l.pole="1" --r.pole="7"

spec = matrix(c(
	'name', NA, 1, "character", "Element names",
	'l.name', NA, 1, "character", "Left side constructs",
	'r.name', NA, 1, "character", "Right side constructs",
	'scores', NA, 1, "character", "Scores",
	'l.pole', NA, 1, "integer", "Left pole rating",
	'r.pole', NA, 1, "integer", "Right pole rating",
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
	setwd(opt$workdir);
	getwd();
}

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

# image generation
ggsave(filename="bertin.png", plot=bertin(grid))