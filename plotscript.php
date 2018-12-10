<?php
session_start();
$data = file_get_contents('php://input');
$data = json_decode($data, true);
$elements = escapeshellarg(implode("|", $data['elements']));
$constructs = escapeshellarg(implode("|", $data['constructs']));
$notconstructs = escapeshellarg(implode("|", $data['notconstructs']));
$scores = escapeshellarg(implode("^|", $data['scores']));
$ratingL = escapeshellarg($data['ratingL']);
$ratingR = escapeshellarg($data['ratingR']);

$workingdir = tempdir(null, session_id() . '_');
$args = "--name=$elements --l.name=$constructs --r.name=$notconstructs --scores=$scores --l.pole=$ratingL --r.pole=$ratingR --workdir=\"$workingdir\"";
exec("Rscript plotscript.R $args 2>&1", $output, $return_var);
var_dump($output);

//echo $workingdir;
//var_dump(is_dir($workingdir), is_writable($workingdir));
//var_dump(rmdir($workingdir));
//echo session_id();

zip($workingdir);
echo "zipped";

/** By Will https://stackoverflow.com/a/30010928
 * Creates a random unique temporary directory, with specified parameters,
 * that does not already exist (like tempnam(), but for dirs).
 *
 * Created dir will begin with the specified prefix, followed by random
 * numbers.
 *
 * @link https://php.net/manual/en/function.tempnam.php
 *
 * @param string|null $dir Base directory under which to create temp dir.
 *     If null, the default system temp dir (sys_get_temp_dir()) will be
 *     used.
 * @param string $prefix String with which to prefix created dirs.
 * @param int $mode Octal file permission mask for the newly-created dir.
 *     Should begin with a 0.
 * @param int $maxAttempts Maximum attempts before giving up (to prevent
 *     endless loops).
 * @return string|bool Full path to newly-created dir, or false on failure.
 */
function tempdir($dir = null, $prefix = 'tmp_', $mode = 0700, $maxAttempts = 1000)
{
    /* Use the system temp dir by default. */
    if (is_null($dir))
    {
        $dir = sys_get_temp_dir();
    }

    /* Trim trailing slashes from $dir. */
    $dir = rtrim($dir, DIRECTORY_SEPARATOR);

    /* If we don't have permission to create a directory, fail, otherwise we will
     * be stuck in an endless loop.
     */
    if (!is_dir($dir) || !is_writable($dir))
    {
        return false;
    }

    /* Make sure characters in prefix are safe. */
    if (strpbrk($prefix, '\\/:*?"<>|') !== false)
    {
        return false;
    }

    /* Attempt to create a random directory until it works. Abort if we reach
     * $maxAttempts. Something screwy could be happening with the filesystem
     * and our loop could otherwise become endless.
     */
    $attempts = 0;
    do
    {
        $path = sprintf('%s%s%s%s', $dir, DIRECTORY_SEPARATOR, $prefix, mt_rand(100000, mt_getrandmax()));
    } while (
        !mkdir($path, $mode) &&
        $attempts++ < $maxAttempts
    );

    return $path;
}

//By Dador https://stackoverflow.com/a/4914807
function zip($dir)
{
	// Get real path for our folder
	$rootPath = realpath($dir);

	// Initialize archive object
	$zip = new ZipArchive();
	$zip->open($dir . '/analysis.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);

	// Create recursive directory iterator
	/** @var SplFileInfo[] $files */
	$files = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($rootPath),
		RecursiveIteratorIterator::LEAVES_ONLY
	);

	foreach ($files as $name => $file)
	{
		// Skip directories (they would be added automatically)
		if (!$file->isDir())
		{
			// Get real and relative path for current file
			$filePath = $file->getRealPath();
			$relativePath = substr($filePath, strlen($rootPath) + 1);

			// Add current file to archive
			$zip->addFile($filePath, $relativePath);
			
			// Add current file to "delete list"
			// delete it later cause ZipArchive create archive only after calling close function and ZipArchive lock files until archive created)
			//if ($file->getFilename() != 'important.txt')
			//{
				$filesToDelete[] = $filePath;
			//}
		}
	}

	// Zip archive will be created only after closing object
	$zip->close();
	
	// Delete all files from "delete list"
	foreach ($filesToDelete as $file)
	{
		unlink($file);
	}
}
?>