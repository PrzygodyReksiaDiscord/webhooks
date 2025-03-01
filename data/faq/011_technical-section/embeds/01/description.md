**1. Games are laggy. Sometimes previous animation frames just remain on the screen, covering the background. How can I fix that?** Use a “wrapper” - a file or a program that will help the game display its graphics correctly. Currently recommended wrappers are [cnc-ddraw](https://discord.com/channels/822931925618524240/909046389227536426/1155563864147120308) and [DxWnd](https://www.przygodyreksia.aidemmedia.pl/pliki/kretes/forum/reksioforum/viewtopic.php?p=261312#p261312). Warning: only one wrapper should be used at a time.
**2. Games are not launching or they do but then crash after some time.** First, try out built-in compatibility modes, e.g. Windows XP (Service Pack 3): https://support.microsoft.com/en-us/windows/make-older-apps-or-programs-compatible-with-windows-783d6dd7-b439-bdb0-0490-54eea0f45938. Warning: some of the modes cause your saves to be reset - make a backup if needed.
Sometimes reinstalling the game helps. For that, you should use an ISO from a trusted site (see item 1 from the Adventures of Reksio section of this FAQ).
If there’s a pop-up about missing CD before the game exits, you should mount the ISO (by double-clicking it on Windows 10/11) or insert the physical disk into your CD drive. 
Some crashes are caused by bugs in the games. They can be fixed by applying patches (see item 8 below). 
**3. I’ve heard you can run the games in windowed mode. How to do this?** When using recommended wrappers (see item 1 above), you can enter windowed mode by: 
- (cnc-ddraw) pressing Alt-Enter when the game is running,
- (DxWnd) changing game configuration in DxWnd before starting the game.
Without wrappers, you can append -window option to the game shortcut according to the instructions: https://discord.com/channels/822931925618524240/909046389227536426/931969299407577138.
**4. I want to show the games to my friends but Discord has trouble streaming them.** Running the games in windowed mode (see item 3 above) should help.
**5. A checksum error appears when I try to install a game.** It means the game disk is corrupted. Download a fresh copy from a trusted site (see item 1 from the Adventures of Reksio section of this FAQ).
**6. I want to use images/sounds from the series. Where can I get them from?** Sounds (voice lines and SFX) are stored inside wavs folder in the installation directory of each game.
Backgrounds and animations can be extracted from game files with [Anndrzem](https://github.com/mysliwy112/AM-transcoder) tool. To make it easier, all backgrounds have been extracted and placed on [Google Drive](https://drive.google.com/drive/u/0/folders/1z0M8z1urpdIzxrJz_9HS-bBTSaxNMXXR) and all animations have been uploaded to GitHub: https://mysliwy112.github.io/.
Remember to reference the source of assets used in your projects by providing a short note consisting of the name of the game, year of publication and the name of the publisher - AidemMedia.
**7. Where are game saves stored?** 2D game saves are located in the installation dir of each game (or in its VirtualStore equivalent).
- Reksio and the Pirate Treasure - `Piraci.ini` (of `Template.ini`) file
- Reksio and UFO - `Ufo.ini` file
- Reksio and the Wizards - the whole `common` folder
- Reksio and the Time Machine - the whole `common` folder
- Reksio and Captain Nemo - the whole `common\save` folder
- Reksio and Moles in Action! - two folders: `common\save` and `common\save_bd`
Reksio and Moles: The Mystery of the Third Dimension is saved in a file named `Default.prf` located in `%AppData%\AidemMedia\Rex3D`.
City of Secrets stores its saves in its folder in `%AppData%\Aidem Media`.
Save files of City of Secrets 2 can be found in `%LocalAppData%Low\Aidem Media Sp_ z o_ o_\City Of Secrets 2 Episode 1`.